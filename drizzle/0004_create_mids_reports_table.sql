CREATE TABLE IF NOT EXISTS "mids_reports" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "user_email" TEXT NOT NULL,
  "report_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "attachments" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "status" TEXT DEFAULT 'submitted'
);