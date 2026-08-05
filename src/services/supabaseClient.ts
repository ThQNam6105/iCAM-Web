import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zzzoqazbembwstfvvqja.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em9xYXpiZW1id3N0ZnZ2cWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDY4ODksImV4cCI6MjEwMTUyMjg4OX0.tA59bmIc2cJtNPIjxkjVWCn-IRpDPS-wwQXaqc_owRM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
