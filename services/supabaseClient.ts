import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con la URL y la clave anónima de tu proyecto de Supabase.
const supabaseUrl = 'https://lozqthqmercbbzlafadj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvenF0aHFtZXJjYmJ6bGFmYWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTYxMTUsImV4cCI6MjA3NTY3MjExNX0.3M08WFFl6oP_2Vj8xV_v8JagW6N9txF0FDDtshldxms';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
