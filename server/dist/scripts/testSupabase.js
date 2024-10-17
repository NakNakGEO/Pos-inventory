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
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../supabase");
function testSupabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase.from('users').select('username').limit(1);
        if (error) {
            console.error('Supabase connection error:', error);
        }
        else {
            console.log('Successfully connected to Supabase');
            console.log('Sample data:', data);
        }
    });
}
testSupabase().catch(console.error);
