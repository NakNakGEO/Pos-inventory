import { config } from '../config'

console.log('SUPABASE_URL:', config.supabaseUrl);
console.log('SUPABASE_API_KEY:', config.supabaseApiKey ? '[REDACTED]' : 'Not set');
console.log('JWT_SECRET_KEY:', config.jwtSecretKey ? '[REDACTED]' : 'Not set');
