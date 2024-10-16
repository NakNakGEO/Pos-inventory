import dotenv from 'dotenv';

dotenv.config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_API_KEY:', process.env.SUPABASE_API_KEY ? '[REDACTED]' : 'Not set');
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? '[REDACTED]' : 'Not set');
