"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
console.log('SUPABASE_URL:', config_1.config.supabaseUrl);
console.log('SUPABASE_API_KEY:', config_1.config.supabaseApiKey ? '[REDACTED]' : 'Not set');
console.log('JWT_SECRET_KEY:', config_1.config.jwtSecretKey ? '[REDACTED]' : 'Not set');
