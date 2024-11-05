import express from 'express';
import { pool } from '../helper/db.js';
import bcrypt, { compare } from 'bcrypt';

const router = express.Router();

router.post('/user/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const express = require('express');
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        const ApiError = require('../helpers/ApiError');
        
        const router = express.Router();
        
        router.post('/register', async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new ApiError('Email and password are required', 400);
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const userId = await User.insertUser({ email, password: hashedPassword });
                res.status(201).json({ id: userId });
            } catch (error) {
                next(error);
            }
        });
        
        router.post('/login', async (req, res, next) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new ApiError('Email and password are required', 400);
                }
                const user = await User.selectUserByEmail(email);
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    throw new ApiError('Invalid email or password', 401);
                }
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY);
                res.status(200).json({ id: user.id, email: user.email, token });
            } catch (error) {
                next(error);
            }
        });
        
        module.exports = router;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Check for duplicate email
        if (error.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ error: 'Email already exists' });
        }
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    const invalid_message = 'Invalid credentials'
    try{
        pool.query('SELECT * feom account where email=$1',
           req.body.email, (error, result) => {
               if (error) {
                   next (error)
               }
               if (result.rowCount === 0) {
                   return next(new Error(invalid_message))
                   compare(req.body.password, result.rows[0].password, (error, isMatch) => {
                       if (error) {
                           return next(error)
                       }
                       if (!match) {
                           return next(new Error(invalid_message))
                       const token = sign({user: req.body.email},process.env.JWT_SECRET_KEY)
                       const user = result.rows[0]
                       return res.status(200).json(
                        {
                            'id': user.id,
                            'email': user.email,
                            'token': token
                        }
                          )
                          }
                     })
                }
              })
    } catch (error) {
        return next(error)
    }
})

export default router;  