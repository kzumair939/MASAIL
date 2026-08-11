-- Runs once on first container start. JPA (ddl-auto=update) creates the tables
-- themselves; this file only adds performance indexes on the columns the API
-- filters/sorts by most, so it's safe to run before or after Hibernate does its part.
-- Postgres will simply skip CREATE INDEX IF NOT EXISTS statements that already exist
-- once JPA has created the tables and this is re-run.

DO $$
BEGIN
  -- These indexes are created defensively; if the tables don't exist yet
  -- (first-ever boot, before Hibernate runs), this script exits quietly and
  -- the app's own indexes below are skipped until the next deploy/migration.
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'issues') THEN
    CREATE INDEX IF NOT EXISTS idx_issues_area ON issues (area);
    CREATE INDEX IF NOT EXISTS idx_issues_status ON issues (status);
    CREATE INDEX IF NOT EXISTS idx_issues_reported_by ON issues (reported_by);
    CREATE INDEX IF NOT EXISTS idx_issues_assigned_officer ON issues (assigned_officer_id);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'donations') THEN
    CREATE INDEX IF NOT EXISTS idx_donations_issue ON donations (issue_id, donated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations (campaign_id, donated_at DESC);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'verification_applications') THEN
    CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_applications (status);
    CREATE INDEX IF NOT EXISTS idx_verification_user ON verification_applications (user_id);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
  END IF;
END $$;
