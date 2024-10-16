import { supabase } from '../supabase';

async function testSupabase() {
  const { data, error } = await supabase.from('users').select('username').limit(1);

  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Successfully connected to Supabase');
    console.log('Sample data:', data);
  }
}

testSupabase().catch(console.error);
