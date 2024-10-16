import dotenv from 'dotenv';
import path from 'path';
import { supabase } from '../supabase';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_API_KEY:', process.env.SUPABASE_API_KEY);

async function hashPasswords() {
  const { data: users, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    console.log(`Processing user ${user.id} (${user.username})`);
    console.log(`Current password: ${user.password}`);
    
    const hashedPassword = await bcrypt.hash(user.password, 12); // Use 12 or higher
    console.log(`New hashed password: ${hashedPassword}`);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);
    
    if (updateError) {
      console.error(`Error updating user ${user.id}:`, updateError);
    } else {
      console.log(`Updated password for user ${user.id}`);
      
      // Verify the update
      const { data: updatedUser, error: fetchError } = await supabase
        .from('users')
        .select('password')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching updated user ${user.id}:`, fetchError);
      } else {
        console.log(`Verified new password for user ${user.id}: ${updatedUser.password}`);
      }
    }
    console.log('---');
  }
}

hashPasswords().then(() => console.log('Password hashing complete')).catch(console.error);
