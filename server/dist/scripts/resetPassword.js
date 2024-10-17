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
function resetPassword(username, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Attempting to reset password for user: ${username}`);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        console.log(`Generated new hash: ${hashedPassword}`);
        const { data, error } = yield supabase_1.supabase
            .from('users') // Make sure this is the correct table name
            .update({ password: hashedPassword })
            .eq('username', username);
        if (error) {
            console.error('Error resetting password:', error);
            return;
        }
        console.log('Update operation result:', data);
        // Fetch the user again to confirm the update
        const { data: updatedUser, error: fetchError } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (fetchError) {
            console.error('Error fetching updated user:', fetchError);
        }
        else {
            console.log('User data after update attempt:', updatedUser);
        }
        // Verify the password
        if (updatedUser) {
            const passwordMatch = yield bcrypt_1.default.compare(newPassword, updatedUser.password);
            console.log('New password match result:', passwordMatch);
        }
    });
}
resetPassword('admin_user', 'asdasd')
    .then(() => console.log('Reset complete'))
    .catch(console.error);
