"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, '../.env');
dotenv_1.default.config({ path: envPath });
exports.config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseApiKey: process.env.SUPABASE_API_KEY,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    port: process.env.PORT || 3000
};
if (!exports.config.supabaseUrl || !exports.config.supabaseApiKey || !exports.config.jwtSecretKey) {
    throw new Error('Missing required environment variables');
}
