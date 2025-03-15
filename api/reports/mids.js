import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc } from 'drizzle-orm';
import { mids } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('MID reports API request received');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Fetching MID reports from database');
    const reports = await db.select()
      .from(mids)
      .where(eq(mids.staffId, user.id))
      .orderBy(desc(mids.createdAt))
      .limit(50);
    
    console.log(`Retrieved ${reports.length} MID reports`);
    
    await client.end();
    
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching MID reports:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}