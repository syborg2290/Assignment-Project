"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan")); // HTTP request logger
const helmet_1 = __importDefault(require("helmet")); // Security middleware
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
// Database Connection with logging
mongoose_1.default.connect(config_1.MONGODB_URI, {
    dbName: config_1.DB_NAME
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use((0, helmet_1.default)()); // Basic security enhancements
app.use((0, morgan_1.default)('tiny')); // Logging HTTP requests
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});
// Route setup
app.use('/api', authRoutes_1.default);
// Catch-all route for unhandled requests
app.use('*', (req, res) => {
    res.status(404).send({ error: 'Not Found' });
});
// Start server
app.listen(config_1.PORT, () => {
    console.log(`Server is running on port ${config_1.PORT}`);
});
