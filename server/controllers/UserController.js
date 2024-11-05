const User = require('../models/User');
const ApiError = require('../helpers/ApiError');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new ApiError('Email and password are required', 400);
            }
            const userId = await User.insertUser({ email, password });
            res.status(201).json({ id: userId, email });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new ApiError('Email and password are required', 400);
            }
            const user = await User.selectUserByEmail(email);
            if (!user || user.password !== password) {
                throw new ApiError('Invalid email or password', 401);
            }
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret');
            res.status(200).json({ id: user.id, email: user.email, token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;