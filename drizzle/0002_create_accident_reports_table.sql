CREATE TABLE IF NOT EXISTS "accident_reports" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "user_email" TEXT NOT NULL,
  "incident_date" TIMESTAMP NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "involved_parties" TEXT NOT NULL,
  "injuries" BOOLEAN NOT NULL,
  "property_damage" BOOLEAN NOT NULL,
  "witness_info" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "images" TEXT,
  "status" TEXT DEFAULT 'submitted'
);