DROP TABLE IF EXISTS "clients";
CREATE TABLE "clients" (
  "id" SERIAL,
  "data" jsonb,
  PRIMARY KEY ("id")
);
