import express, { Request, Response, NextFunction, Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan'; // HTTP request logger
import helmet from 'helmet'; // Security middleware
import authRoutes from './routes/authRoutes';
import { PORT, MONGODB_URI, DB_NAME } from './config/config';

const app: Application = express();

// Database Connection with logging
mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Basic security enhancements
app.use(morgan('tiny')); // Logging HTTP requests

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

// Route setup
app.use('/api', authRoutes);

// Catch-all route for unhandled requests
app.use('*', (req, res) => {
    res.status(404).send({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
