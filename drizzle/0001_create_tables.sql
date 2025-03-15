CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" SERIAL PRIMARY KEY,
  "staff_id" UUID NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "accident_reports" (
  "id" SERIAL PRIMARY KEY,
  "staff_id" UUID NOT NULL,
  "date" DATE NOT NULL,
  "time" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "vehicles_involved" TEXT NOT NULL,
  "injuries" BOOLEAN NOT NULL,
  "injury_details" TEXT,
  "witnesses" TEXT,
  "driver_name" TEXT NOT NULL,
  "bus_number" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "bus_movements" (
  "id" SERIAL PRIMARY KEY,
  "staff_id" UUID NOT NULL,
  "bus_number" TEXT NOT NULL,
  "driver_name" TEXT NOT NULL,
  "departure_location" TEXT NOT NULL,
  "arrival_location" TEXT NOT NULL,
  "departure_time" TIMESTAMP NOT NULL,
  "arrival_time" TIMESTAMP,
  "status" TEXT NOT NULL,
  "passenger_count" INTEGER,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "mids" (
  "id" SERIAL PRIMARY KEY,
  "staff_id" UUID NOT NULL,
  "mid_number" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "incident_type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "people_involved" TEXT,
  "actions_taken" TEXT NOT NULL,
  "follow_up_required" BOOLEAN NOT NULL,
  "follow_up_details" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);