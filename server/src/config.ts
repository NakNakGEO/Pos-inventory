import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

export const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseApiKey: process.env.SUPABASE_API_KEY,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 3000
};

if (!config.supabaseUrl || !config.supabaseApiKey || !config.jwtSecretKey) {
  throw new Error('Missing required environment variables');
}
