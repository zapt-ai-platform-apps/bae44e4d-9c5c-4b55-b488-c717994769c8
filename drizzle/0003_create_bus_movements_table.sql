CREATE TABLE IF NOT EXISTS "bus_movements" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "user_email" TEXT NOT NULL,
  "bus_id" TEXT NOT NULL,
  "departure_location" TEXT NOT NULL,
  "departure_time" TIMESTAMP NOT NULL,
  "arrival_location" TEXT NOT NULL,
  "arrival_time" TIMESTAMP,
  "passengers" INTEGER,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "status" TEXT DEFAULT 'active'
);