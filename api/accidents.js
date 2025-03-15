import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, Sentry } from './_apiUtils.js';
import { accidentReports } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Accident report API received request');

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.email);

    const { incidentDate, location, description, involvedParties, injuries, propertyDamage, witnessInfo } = req.body;
    
    if (!incidentDate || !location || !description || !involvedParties) {
      return res.status(400).json({ 
        error: 'Required fields: incident date, location, description, and involved parties' 
      });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.insert(accidentReports)
      .values({
        userId: user.id,
        userEmail: user.email,
        incidentDate: new Date(incidentDate),
        location,
        description,
        involvedParties,
        injuries: !!injuries,
        propertyDamage: !!propertyDamage,
        witnessInfo: witnessInfo || null
      })
      .returning();

    console.log('Accident report created:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your accident report has been submitted successfully.' 
    });
  } catch (error) {
    console.error('Error in accident report API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'An error occurred while submitting your accident report' });
  }
}