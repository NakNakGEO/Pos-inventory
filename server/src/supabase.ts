import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

  // console.log('Current working directory:', process.cwd())
  // console.log('__dirname:', __dirname)

const envPath = path.resolve(__dirname, '../.env')
// console.log('Attempting to load .env from:', envPath)

const result = dotenv.config({ path: envPath })

if (result.error) {
  // console.error('Error loading .env file:', result.error)
} else {
  // console.log('.env file loaded successfully')
}

// console.log('Environment variables:', process.env)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_API_KEY

// console.log('SUPABASE_URL:', supabaseUrl)
// console.log('SUPABASE_API_KEY:', supabaseKey ? '[REDACTED]' : 'undefined')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL or SUPABASE_API_KEY is not set in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
