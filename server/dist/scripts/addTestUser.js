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
const supabase_1 = require("../supabase");
const bcrypt_1 = __importDefault(require("bcrypt"));
function addTestUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const testUsername = 'testuser';
        const testPassword = 'testpassword123';
        const hashedPassword = yield bcrypt_1.default.hash(testPassword, 10);
        const { data, error } = yield supabase_1.supabase
            .from('users')
            .insert([
            { username: testUsername, password: hashedPassword, email: 'test@example.com', role: 'test' }
        ]);
        if (error) {
            console.error('Error adding test user:', error);
        }
        else {
            console.log('Test user added successfully:', data);
        }
    });
}
addTestUser().catch(console.error);
