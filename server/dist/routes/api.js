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
const auth_1 = require("../auth");
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables');
}

const router = express_1.default.Router();

// Centralized error handling middleware
const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
};

// Input validation middleware
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Replace this with your actual user authentication logic
        const { data, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Assuming you have a function to check the password
        if (!checkPassword(password, data.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = { id: data.id, username: data.username };
        const token = jsonwebtoken_1.default.sign(user, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Apply authenticateToken middleware to all routes below this line
router.use(auth_1.authenticateToken);

// Log all requests
router.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`);
    next();
});

// Protected routes below
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('products').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.post('/products', 
    (0, express_validator_1.body)('name').isString().notEmpty(),
    (0, express_validator_1.body)('price').isNumeric(),
    (0, express_validator_1.body)('stock').isInt({ min: 0 }),
    validateRequest,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase.from('products').insert(req.body).select().single();
            if (error)
                throw error;
            res.status(201).json(data);
        }
        catch (error) {
            handleError(res, error);
        }
    })
);

router.put('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Product not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = yield supabase_1.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Product not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

// Suppliers routes
router.get('/suppliers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('suppliers').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.post('/suppliers',
    (0, express_validator_1.body)('name').isString().notEmpty(),
    (0, express_validator_1.body)('contact').isString(),
    validateRequest,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase.from('suppliers').insert(req.body).select().single();
            if (error)
                throw error;
            res.status(201).json(data);
        }
        catch (error) {
            handleError(res, error);
        }
    })
);

router.put('/suppliers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Supplier not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.delete('/suppliers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = yield supabase_1.supabase
            .from('suppliers')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.get('/suppliers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('suppliers')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Supplier not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

// Categories routes
router.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_1.supabase.from('categories').select('*');
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.post('/categories',
    (0, express_validator_1.body)('name').isString().notEmpty(),
    validateRequest,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase.from('categories').insert(req.body).select().single();
            if (error)
                throw error;
            res.status(201).json(data);
        }
        catch (error) {
            handleError(res, error);
        }
    })
);

router.put('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('categories')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Category not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.delete('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = yield supabase_1.supabase.from('categories').delete().eq('id', id);
        if (error)
            throw error;
        res.status(204).send();
    }
    catch (error) {
        handleError(res, error);
    }
}));

router.get('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, error } = yield supabase_1.supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            res.status(404).json({ error: 'Category not found' });
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));

exports.default = router;
