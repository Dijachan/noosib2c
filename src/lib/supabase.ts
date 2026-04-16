import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://begqvaikxdixitxbsfiu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZ3F2YWlreGRpeGl0eGJzZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDIwNDMsImV4cCI6MjA5MTkxODA0M30.2FwgA4kt8-mNeMVj3PYncj91lbhmvXxWcu-40bbv3_o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
