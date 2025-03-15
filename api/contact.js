import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authenticateUser, Sentry } from './_apiUtils.js';
import { contactMessages } from '../drizzle/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Contact API received request:', req.method);

  try {
    const user = await authenticateUser(req);
    console.log('User authenticated:', user.email);

    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.insert(contactMessages)
      .values({
        userId: user.id,
        userEmail: user.email,
        subject,
        message
      })
      .returning();

    console.log('Contact message created:', result[0].id);
    
    await client.end();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will respond soon.' 
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'An error occurred while sending your message' });
  }
}