"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("./config");
exports.supabase = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseApiKey);
