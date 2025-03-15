import { pgTable, serial, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('pending')
});

export const accidentReports = pgTable('accident_reports', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  incidentDate: timestamp('incident_date').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  involvedParties: text('involved_parties').notNull(),
  injuries: boolean('injuries').notNull(),
  propertyDamage: boolean('property_damage').notNull(),
  witnessInfo: text('witness_info'),
  createdAt: timestamp('created_at').defaultNow(),
  images: text('images'),
  status: text('status').default('submitted')
});

export const busMovements = pgTable('bus_movements', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  busId: text('bus_id').notNull(),
  departureLocation: text('departure_location').notNull(),
  departureTime: timestamp('departure_time').notNull(),
  arrivalLocation: text('arrival_location').notNull(),
  arrivalTime: timestamp('arrival_time'),
  passengers: integer('passengers'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('active')
});

export const midsReports = pgTable('mids_reports', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  reportType: text('report_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  attachments: text('attachments'),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('submitted')
});