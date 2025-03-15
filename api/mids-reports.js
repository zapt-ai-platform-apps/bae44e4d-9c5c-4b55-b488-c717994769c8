import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, Sentry } from './_apiUtils.js';
import { midsReports } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('MIDS report API received request');

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.email);

    const { reportType, title, description } = req.body;
    
    if (!reportType || !title || !description) {
      return res.status(400).json({ 
        error: 'Required fields: report type, title, and description' 
      });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.insert(midsReports)
      .values({
        userId: user.id,
        userEmail: user.email,
        reportType,
        title,
        description
      })
      .returning();

    console.log('MIDS report created:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your MIDS report has been submitted successfully.' 
    });
  } catch (error) {
    console.error('Error in MIDS report API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'An error occurred while submitting your MIDS report' });
  }
}