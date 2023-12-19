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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config/config");
// Middleware to verify token and authenticate user
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the token from the Authorization header
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'Unauthenticated!' });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        // Find the user associated with the token
        const user = yield user_1.default.findById(decoded._id);
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
    }
    catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
});
exports.authMiddleware = authMiddleware;
