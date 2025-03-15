import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, Sentry } from './_apiUtils.js';
import { busMovements } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Bus movement API received request');

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.email);

    const { 
      busId, 
      departureLocation, 
      departureTime, 
      arrivalLocation, 
      arrivalTime, 
      passengers, 
      notes 
    } = req.body;
    
    if (!busId || !departureLocation || !departureTime || !arrivalLocation) {
      return res.status(400).json({ 
        error: 'Required fields: bus ID, departure location, departure time, and arrival location' 
      });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.insert(busMovements)
      .values({
        userId: user.id,
        userEmail: user.email,
        busId,
        departureLocation,
        departureTime: new Date(departureTime),
        arrivalLocation,
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
        passengers: passengers || null,
        notes: notes || null
      })
      .returning();

    console.log('Bus movement record created:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your bus movement information has been recorded successfully.' 
    });
  } catch (error) {
    console.error('Error in bus movement API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'An error occurred while recording bus movement information' });
  }
}