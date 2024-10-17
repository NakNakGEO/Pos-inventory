"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const config_1 = require("./config");
const app = (0, express_1.default)();
console.log('Setting up Express server');
app.use((0, cors_1.default)());
console.log('CORS middleware added');
app.use(express_1.default.json());
console.log('JSON body parser middleware added');
if (!process.env.JWT_SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not set in environment variables');
    process.exit(1);
}
app.use('/api', api_1.default);
console.log('API routes added');
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
