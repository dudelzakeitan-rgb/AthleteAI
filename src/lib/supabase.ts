import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mkttcgrzpushchabwemo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdHRjZ3J6cHVzaGNoYWJ3ZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMDg4NDksImV4cCI6MjA5NzU4NDg0OX0.hf2pb2PmHqmuHzyowXCzsUJQQ6KX9gLnkIk9VOXRrwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
