-- Add mode column to support work/personal mode separation
-- Run this in the Supabase SQL editor

ALTER TABLE day_todos      ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'personal';
ALTER TABLE backlog_todos  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'personal';
ALTER TABLE plans          ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'personal';
ALTER TABLE rituals        ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'personal';
