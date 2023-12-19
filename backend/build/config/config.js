"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.DB_NAME = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from the .env file
dotenv_1.default.config();
// Export the PORT variable, defaulting to 5000 if not set in the environment
// This is used to determine on which port the server will listen
exports.PORT = process.env.PORT || 5000;
// Export the MongoDB connection URI from the environment variables
// This URI is used to connect to the MongoDB database
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.DB_NAME = process.env.DB_NAME;
// Export the JWT (JSON Web Token) secret from the environment variables
// This secret key is used to sign and verify JWT tokens for authentication
exports.JWT_SECRET = process.env.JWT_SECRET;
