import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Export the PORT variable, defaulting to 5000 if not set in the environment
// This is used to determine on which port the server will listen
export const PORT = process.env.PORT || 5000;

// Export the MongoDB connection URI from the environment variables
// This URI is used to connect to the MongoDB database
export const MONGODB_URI = process.env.MONGODB_URI!;

export const DB_NAME = process.env.DB_NAME!;

// Export the JWT (JSON Web Token) secret from the environment variables
// This secret key is used to sign and verify JWT tokens for authentication
export const JWT_SECRET = process.env.JWT_SECRET!;
