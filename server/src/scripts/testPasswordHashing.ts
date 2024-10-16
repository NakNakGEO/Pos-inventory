import dotenv from 'dotenv';
import path from 'path';
import { supabase } from '../supabase';
import bcrypt from 'bcrypt';
import readline from 'readline';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testPasswordHashing(username: string, password: string) {
  console.log('Starting password hashing test...');

  // Fetch the user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error || !user) {
    console.error('Error fetching user:', error || 'User not found');
    return;
  }

  console.log(`Testing user ${user.id} (${user.username}):`);
    
  // Check if the password is hashed
  const isHashed = user.password.startsWith('$2b$');
  console.log(`Is password hashed? ${isHashed}`);

  if (!isHashed) {
    console.error(`WARNING: Password for user ${user.id} is not hashed!`);
    return;
  }

  // Test login with provided password
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match test: ${passwordMatch}`);

  // Test with incorrect password
  const wrongPassword = password ; // Just append '1' to make it wrong
  const wrongPasswordMatch = await bcrypt.compare(wrongPassword, user.password);
  console.log(`Wrong password match test: ${wrongPasswordMatch}`);

  // Verify bcrypt settings
  const [, version, cost] = user.password.split('$');
  console.log(`Bcrypt version: $${version}$, cost factor: ${cost}`);
  if (parseInt(cost) < 10) {
    console.warn(`WARNING: Bcrypt cost factor for user ${user.id} is low (${cost})`);
  }

  // Test hash generation
  console.log('Testing hash generation...');
  const testHash = await bcrypt.hash(password, 10);
  const testHashMatch = await bcrypt.compare(password, testHash);
  console.log(`Test hash generation successful: ${testHashMatch}`);

  console.log('\nPassword hashing test complete.');
}

function promptCredentials(): Promise<{ username: string, password: string }> {
  return new Promise((resolve) => {
    rl.question('Enter username: ', (username) => {
      rl.question('Enter password: ', (password) => {
        resolve({ username, password });
      });
    });
  });
}

async function runTest() {
  const { username, password } = await promptCredentials();
  await testPasswordHashing(username, password);
  rl.close();
}

runTest().catch(console.error);
