import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import { config } from './config'

const app = express();

console.log('Setting up Express server');

app.use(cors());
console.log('CORS middleware added');

app.use(express.json());
console.log('JSON body parser middleware added');

if (!process.env.JWT_SECRET_KEY) {
  console.error('JWT_SECRET_KEY is not set in environment variables');
  process.exit(1);
}

app.use('/api', apiRoutes);
console.log('API routes added');

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
