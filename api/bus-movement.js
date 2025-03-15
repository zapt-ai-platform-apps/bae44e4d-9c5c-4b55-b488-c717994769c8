import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { busMovements } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('Bus movement API request received');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const { 
      busNumber, 
      driverName, 
      departureLocation, 
      arrivalLocation, 
      departureTime, 
      arrivalTime, 
      status, 
      passengerCount, 
      notes 
    } = req.body;
    
    // Validate required fields
    if (!busNumber || !driverName || !departureLocation || !arrivalLocation || !departureTime || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // If status is completed, arrival time is required
    if (status === 'completed' && !arrivalTime) {
      return res.status(400).json({ error: 'Arrival time is required for completed trips' });
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Inserting bus movement data into database');
    const result = await db.insert(busMovements).values({
      staffId: user.id,
      busNumber,
      driverName,
      departureLocation,
      arrivalLocation,
      departureTime,
      arrivalTime,
      status,
      passengerCount,
      notes
    }).returning();
    
    console.log('Bus movement data inserted successfully:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true,
      message: 'Bus movement data saved successfully',
      id: result[0].id
    });
  } catch (error) {
    console.error('Error handling bus movement submission:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}