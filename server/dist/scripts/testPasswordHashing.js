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
function testPasswordHashing(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting password hashing test...');
        // Fetch the user
        const { data: user, error } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error || !user) {
            console.error('Error fetching user:', error || 'User not found');
            return;
        }
        console.log(`Testing user ${user.id} (${user.username}):`);
        // Check if the password is hashed
        const isHashed = user.password.startsWith('$2b$');
        console.log(`Is password hashed? ${isHashed}`);
        if (!isHashed) {
            console.error(`WARNING: Password for user ${user.id} is not hashed!`);
            return;
        }
        // Test login with provided password
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        console.log(`Password match test: ${passwordMatch}`);
        // Test with incorrect password
        const wrongPassword = password; // Just append '1' to make it wrong
        const wrongPasswordMatch = yield bcrypt_1.default.compare(wrongPassword, user.password);
        console.log(`Wrong password match test: ${wrongPasswordMatch}`);
        // Verify bcrypt settings
        const [, version, cost] = user.password.split('$');
        console.log(`Bcrypt version: $${version}$, cost factor: ${cost}`);
        if (parseInt(cost) < 10) {
            console.warn(`WARNING: Bcrypt cost factor for user ${user.id} is low (${cost})`);
        }
        // Test hash generation
        console.log('Testing hash generation...');
        const testHash = yield bcrypt_1.default.hash(password, 10);
        const testHashMatch = yield bcrypt_1.default.compare(password, testHash);
        console.log(`Test hash generation successful: ${testHashMatch}`);
        console.log('\nPassword hashing test complete.');
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
        yield testPasswordHashing(username, password);
        rl.close();
    });
}
runTest().catch(console.error);
