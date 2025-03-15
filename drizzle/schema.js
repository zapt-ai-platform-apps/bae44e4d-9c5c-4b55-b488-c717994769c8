import { pgTable, serial, text, timestamp, uuid, boolean, date, integer } from 'drizzle-orm/pg-core';

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  staffId: uuid('staff_id').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  department: text('department').notNull(),
  priority: text('priority').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const accidentReports = pgTable('accident_reports', {
  id: serial('id').primaryKey(),
  staffId: uuid('staff_id').notNull(),
  date: date('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  vehiclesInvolved: text('vehicles_involved').notNull(),
  injuries: boolean('injuries').notNull(),
  injuryDetails: text('injury_details'),
  witnesses: text('witnesses'),
  driverName: text('driver_name').notNull(),
  busNumber: text('bus_number').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const busMovements = pgTable('bus_movements', {
  id: serial('id').primaryKey(),
  staffId: uuid('staff_id').notNull(),
  busNumber: text('bus_number').notNull(),
  driverName: text('driver_name').notNull(),
  departureLocation: text('departure_location').notNull(),
  arrivalLocation: text('arrival_location').notNull(),
  departureTime: timestamp('departure_time').notNull(),
  arrivalTime: timestamp('arrival_time'),
  status: text('status').notNull(),
  passengerCount: integer('passenger_count'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

export const mids = pgTable('mids', {
  id: serial('id').primaryKey(),
  staffId: uuid('staff_id').notNull(),
  midNumber: text('mid_number').notNull(),
  date: date('date').notNull(),
  incidentType: text('incident_type').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  peopleInvolved: text('people_involved'),
  actionsTaken: text('actions_taken').notNull(),
  followUpRequired: boolean('follow_up_required').notNull(),
  followUpDetails: text('follow_up_details'),
  createdAt: timestamp('created_at').defaultNow()
});