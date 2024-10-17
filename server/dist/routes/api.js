"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../supabase");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../auth");
const router = express_1.default.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received login request');
    console.log('Request body:', Object.assign(Object.assign({}, req.body), { password: '****' }));
    const { username, password } = req.body;
    if (!username || !password) {
        console.log('Missing username or password');
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }
    try {
        console.log('Querying Supabase for user:', username);
        const { data: user, error } = yield supabase_1.supabase
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Sending successful response');
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
}));
// Products route
router.get('/products', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('products').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
}));
// Categories route
router.get('/categories', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('categories').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'An error occurred while fetching categories' });
    }
}));
// Suppliers route
router.get('/suppliers', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('suppliers').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ error: 'An error occurred while fetching suppliers' });
    }
}));
// Sales route
router.get('/sales', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('sales').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'An error occurred while fetching sales' });
    }
}));
exports.default = router;
