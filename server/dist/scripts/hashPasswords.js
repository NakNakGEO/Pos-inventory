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
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_API_KEY:', process.env.SUPABASE_API_KEY);
function hashPasswords() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: users, error } = yield supabase_1.supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching users:', error);
            return;
        }
        console.log(`Found ${users.length} users`);
        for (const user of users) {
            console.log(`Processing user ${user.id} (${user.username})`);
            console.log(`Current password: ${user.password}`);
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 12); // Use 12 or higher
            console.log(`New hashed password: ${hashedPassword}`);
            const { error: updateError } = yield supabase_1.supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', user.id);
            if (updateError) {
                console.error(`Error updating user ${user.id}:`, updateError);
            }
            else {
                console.log(`Updated password for user ${user.id}`);
                // Verify the update
                const { data: updatedUser, error: fetchError } = yield supabase_1.supabase
                    .from('users')
                    .select('password')
                    .eq('id', user.id)
                    .single();
                if (fetchError) {
                    console.error(`Error fetching updated user ${user.id}:`, fetchError);
                }
                else {
                    console.log(`Verified new password for user ${user.id}: ${updatedUser.password}`);
                }
            }
            console.log('---');
        }
    });
}
hashPasswords().then(() => console.log('Password hashing complete')).catch(console.error);
