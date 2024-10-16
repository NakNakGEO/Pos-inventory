import { supabase } from '../supabase';
import bcrypt from 'bcrypt';

async function hashAllPasswords() {
  const { data: users, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);
    
    if (updateError) {
      console.error(`Error updating user ${user.id}:`, updateError);
    } else {
      console.log(`Updated password for user ${user.id}`);
    }
  }
}

hashAllPasswords().then(() => console.log('All passwords hashed')).catch(console.error);
