import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc } from 'drizzle-orm';
import { busMovements } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('Bus movements API request received');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Fetching bus movements from database');
    const movements = await db.select()
      .from(busMovements)
      .where(eq(busMovements.staffId, user.id))
      .orderBy(desc(busMovements.createdAt))
      .limit(50);
    
    console.log(`Retrieved ${movements.length} bus movements`);
    
    await client.end();
    
    return res.status(200).json(movements);
  } catch (error) {
    console.error('Error fetching bus movements:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}