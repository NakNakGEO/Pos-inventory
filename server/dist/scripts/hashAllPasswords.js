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
function hashAllPasswords() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: users, error } = yield supabase_1.supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching users:', error);
            return;
        }
        for (const user of users) {
            const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
            const { error: updateError } = yield supabase_1.supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', user.id);
            if (updateError) {
                console.error(`Error updating user ${user.id}:`, updateError);
            }
            else {
                console.log(`Updated password for user ${user.id}`);
            }
        }
    });
}
hashAllPasswords().then(() => console.log('All passwords hashed')).catch(console.error);
