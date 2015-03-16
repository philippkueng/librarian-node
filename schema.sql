-- activate the uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "clients";
CREATE TABLE "clients" (
  "id" uuid primary key default uuid_generate_v4(),
  "data" jsonb
);
