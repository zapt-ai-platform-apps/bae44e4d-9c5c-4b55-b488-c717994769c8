import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc } from 'drizzle-orm';
import { contactMessages } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('Contact reports API request received');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Fetching contact messages from database');
    const messages = await db.select()
      .from(contactMessages)
      .where(eq(contactMessages.staffId, user.id))
      .orderBy(desc(contactMessages.createdAt))
      .limit(50);
    
    console.log(`Retrieved ${messages.length} contact messages`);
    
    await client.end();
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}