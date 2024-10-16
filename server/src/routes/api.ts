import express, { Request, Response } from 'express';
import { supabase } from '../supabase';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  console.log('Received login request');
  console.log('Request body:', { ...req.body, password: '****' });

  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing username or password');
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    console.log('Querying Supabase for user:', username);
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    console.log('Supabase query result:', { user: user ? 'found' : 'not found', error });

    if (error || !user) {
      console.log('User not found or Supabase error');
      res.status(400).json({ error: 'User not found' });
      return;
    }

    console.log('Comparing passwords');
    const passwordMatch = password === user.password;
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('Invalid password');
      res.status(400).json({ error: 'Invalid password' });
      return;
    }

    console.log('Generating JWT');
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    
    console.log('Sending successful response');
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

export default router;
