import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import { JWT_SECRET } from '../config/config';

// Middleware to verify token and authenticate user
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Unauthenticated!' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };

        // Find the user associated with the token
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send({ error: 'Not a valid user.' });
        }

        const reqUserProfileId = req.query.id;

        if (reqUserProfileId != user._id) {
            return res.status(401).send({ error: 'Not allowed to perform the action!.' });
        }

        // Attach the user and token to the request object
        req.user = user;
        // req.token = token;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
