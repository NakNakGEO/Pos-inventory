import { supabase } from '../supabase';
import bcrypt from 'bcrypt';

async function addTestUser() {
  const testUsername = 'testuser';
  const testPassword = 'testpassword123';
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([
      { username: testUsername, password: hashedPassword, email: 'test@example.com', role: 'test' }
    ]);

  if (error) {
    console.error('Error adding test user:', error);
  } else {
    console.log('Test user added successfully:', data);
  }
}

addTestUser().catch(console.error);
