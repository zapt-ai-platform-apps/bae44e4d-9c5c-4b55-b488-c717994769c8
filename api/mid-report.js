import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { mids } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('MID report API request received');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const { 
      midNumber, 
      date, 
      incidentType, 
      description, 
      location, 
      peopleInvolved, 
      actionsTaken, 
      followUpRequired, 
      followUpDetails 
    } = req.body;
    
    // Validate required fields
    if (!midNumber || !date || !incidentType || !description || !location || !actionsTaken || followUpRequired === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // If follow-up is required, details are required
    if (followUpRequired && !followUpDetails) {
      return res.status(400).json({ error: 'Follow-up details are required when follow-up is needed' });
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Inserting MID report into database');
    const result = await db.insert(mids).values({
      staffId: user.id,
      midNumber,
      date,
      incidentType,
      description,
      location,
      peopleInvolved,
      actionsTaken,
      followUpRequired,
      followUpDetails
    }).returning();
    
    console.log('MID report inserted successfully:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true,
      message: 'MID report saved successfully',
      id: result[0].id
    });
  } catch (error) {
    console.error('Error handling MID report submission:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}