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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const supabase_1 = require("../supabase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const readline_1 = __importDefault(require("readline"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function testLogin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Testing login for user: ${username}`);
        // Fetch user from database
        const { data: user, error } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error || !user) {
            console.log('User not found');
            return false;
        }
        console.log('User found:', Object.assign(Object.assign({}, user), { password: '[REDACTED]' }));
        // Check if password is hashed
        const isHashed = user.password.startsWith('$2b$');
        console.log(`Is password hashed? ${isHashed}`);
        if (!isHashed) {
            console.error('WARNING: Password is not hashed!');
            return false;
        }
        // Verify bcrypt settings
        const [, version, cost] = user.password.split('$');
        console.log(`Bcrypt version: $${version}$, cost factor: ${cost}`);
        // Test password match
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        console.log(`Password match result: ${passwordMatch}`);
        return passwordMatch;
    });
}
function promptCredentials() {
    return new Promise((resolve) => {
        rl.question('Enter username: ', (username) => {
            rl.question('Enter password: ', (password) => {
                resolve({ username, password });
            });
        });
    });
}
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = yield promptCredentials();
        const loginSuccess = yield testLogin(username, password);
        console.log(`Login ${loginSuccess ? 'successful' : 'failed'}`);
        rl.close();
    });
}
runTest().catch(console.error);
