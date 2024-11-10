import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', todoRouter);
app.use('/user', userRouter);

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message || 'Internal server error' });
});

// 404 handler - keep last
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;