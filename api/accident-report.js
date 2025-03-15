import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { accidentReports } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('Accident report API request received');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const { 
      date, 
      time, 
      location, 
      description, 
      vehiclesInvolved, 
      injuries, 
      injuryDetails, 
      witnesses, 
      driverName, 
      busNumber 
    } = req.body;
    
    // Validate required fields
    if (!date || !time || !location || !description || !vehiclesInvolved || injuries === undefined || !driverName || !busNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // If injuries is true, injuryDetails is required
    if (injuries && !injuryDetails) {
      return res.status(400).json({ error: 'Injury details are required when injuries are reported' });
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Inserting accident report into database');
    const result = await db.insert(accidentReports).values({
      staffId: user.id,
      date,
      time,
      location,
      description,
      vehiclesInvolved,
      injuries,
      injuryDetails,
      witnesses,
      driverName,
      busNumber
    }).returning();
    
    console.log('Accident report inserted successfully:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true,
      message: 'Accident report saved successfully',
      id: result[0].id
    });
  } catch (error) {
    console.error('Error handling accident report submission:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}