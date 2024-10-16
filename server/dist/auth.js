"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables');
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader); // Add this line
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token); // Add this line
    if (token == null) {
        console.log('No token provided'); // Add this line
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err); // Add this line
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
