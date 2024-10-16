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

async function testLogin(username: string, password: string) {
  console.log(`Testing login for user: ${username}`);

  // Fetch user from database
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    console.log('User not found');
    return false;
  }

  console.log('User found:', { ...user, password: '[REDACTED]' });

  // Check if password is hashed
  const isHashed = user.password.startsWith('$2b$');
  console.log(`Is password hashed? ${isHashed}`);

  if (!isHashed) {
    console.error('WARNING: Password is not hashed!');
    return false;
  }

  // Verify bcrypt settings
  const [, version, cost] = user.password.split('$');
  console.log(`Bcrypt version: $${version}$, cost factor: ${cost}`);

  // Test password match
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match result: ${passwordMatch}`);

  return passwordMatch;
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
  const loginSuccess = await testLogin(username, password);
  console.log(`Login ${loginSuccess ? 'successful' : 'failed'}`);
  rl.close();
}

runTest().catch(console.error);
