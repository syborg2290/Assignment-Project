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
exports.userProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config/config");
// Helper function for password hashing
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcryptjs_1.default.hash(password, saltRounds);
});
// Input validation function
const validateUserInput = (email, password, username) => {
    return email.length > 0 && password.length >= 6 && (!username || username.length > 0);
};
// Utility function to sanitize user data
const sanitizeUser = (user) => {
    if (user.toObject) {
        user = user.toObject();
    }
    delete user.password; // Remove password
    delete user.__v; // Remove version key
    return user;
};
// Register new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!validateUserInput(email, password, username)) {
            return res.status(400).send({ error: 'Invalid input' });
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ error: 'User already exists' });
        }
        // const hashedPassword = await hashPassword(password);
        const user = new user_1.default({ email, username, password: password });
        yield user.save();
        res.status(201).send({ user: sanitizeUser(user) });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.register = register;
// User login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }
        const user = yield user_1.default.findOne({ email }).select('+password');
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.JWT_SECRET, { expiresIn: '2h' });
        res.send({ user: sanitizeUser(user), token });
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.login = login;
// Get user profile by ID
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user ID from request parameters
        const userId = req.query.id;
        // Find user by ID
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Send sanitized user data
        res.send({ profile: sanitizeUser(user) });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.userProfile = userProfile;
