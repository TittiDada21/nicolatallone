-- Add image_url column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;

-- Update RLS policies if necessary (usually standard insert/update covers new columns)
-- No special RLS needed for image_url if the standard update policy uses (true) for check.
