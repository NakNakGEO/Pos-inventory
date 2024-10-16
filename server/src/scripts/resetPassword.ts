import { supabase } from '../supabase';
import bcrypt from 'bcrypt';

async function resetPassword(username: string, newPassword: string) {
  console.log(`Attempting to reset password for user: ${username}`);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(`Generated new hash: ${hashedPassword}`);
  
  const { data, error } = await supabase
    .from('users')  // Make sure this is the correct table name
    .update({ password: hashedPassword })
    .eq('username', username);

  if (error) {
    console.error('Error resetting password:', error);
    return;
  }

  console.log('Update operation result:', data);

  // Fetch the user again to confirm the update
  const { data: updatedUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (fetchError) {
    console.error('Error fetching updated user:', fetchError);
  } else {
    console.log('User data after update attempt:', updatedUser);
  }

  // Verify the password
  if (updatedUser) {
    const passwordMatch = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('New password match result:', passwordMatch);
  }
}

resetPassword('admin_user', 'asdasd')
  .then(() => console.log('Reset complete'))
  .catch(console.error);
