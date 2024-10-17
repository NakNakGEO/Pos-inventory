import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config'; // Assuming you've created a config file as suggested earlier

if (!config.jwtSecretKey) {
  throw new Error('JWT_SECRET_KEY is not set in environment variables');
}

export interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  if (token == null) {
    console.log('No token provided');
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, config.jwtSecretKey as string, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      console.log('Token verification failed:', err);
      res.sendStatus(403);
      return;
    }
    console.log('Token verified successfully');
    req.user = decoded;
    next();
  });
};

// You can keep your existing login logic here or in a separate file
// export const login = async (req: Request, res: Response) => {
//   // Your login logic here
// };
