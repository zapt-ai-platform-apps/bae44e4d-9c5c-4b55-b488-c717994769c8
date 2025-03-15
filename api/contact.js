import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { contactMessages } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  console.log('Contact API request received');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.id);
    
    const { subject, message, department, priority } = req.body;
    
    // Validate required fields
    if (!subject || !message || !department || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    console.log('Inserting contact message into database');
    const result = await db.insert(contactMessages).values({
      staffId: user.id,
      subject,
      message,
      department,
      priority
    }).returning();
    
    console.log('Contact message inserted successfully:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true,
      message: 'Contact message saved successfully',
      id: result[0].id
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}