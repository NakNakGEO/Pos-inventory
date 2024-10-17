"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config"); // Assuming you've created a config file as suggested earlier
if (!config_1.config.jwtSecretKey) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables');
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    if (token == null) {
        console.log('No token provided');
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(token, config_1.config.jwtSecretKey, (err, decoded) => {
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
exports.authenticateToken = authenticateToken;
// You can keep your existing login logic here or in a separate file
// export const login = async (req: Request, res: Response) => {
//   // Your login logic here
// };
