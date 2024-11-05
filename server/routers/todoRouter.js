import { pool } from '../helper/db.js';
import { Router } from 'express';
import { emptyOrRows } from '../helper/utils.js';   
import { auth } from '../helper/auth.js';

const router = Router();

// Middleware to validate ID parameter
const validateId = (req, res, next) => {
    const id = req.params.id;
    // More strict validation for SQL injection
    if (!id || typeof id !== 'string' || !/^\d+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    next();
};

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return next(error);
        }
        return res.status(200).json(emptyOrRows(result));
    });
});

router.post('/create',auth,(req, res, next) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', 
        [description], 
        (error, result) => {
            if (error) return next(error);
            return res.status(200).json({id: result.rows[0].id});  // Changed from 201 to 200
    });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    
    // Check for SQL injection first
    if (typeof id === 'string' && /['";]/.test(id)) {
        return res.status(500).json({ error: 'Server error' });
    }

    const numId = parseInt(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    pool.query('DELETE FROM task WHERE id = $1::integer', [numId], 
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Server error' });
            }
            return res.status(200).json({ id: numId });
    });
});

export default router;