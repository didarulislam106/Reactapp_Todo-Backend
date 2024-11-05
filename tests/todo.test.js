import request from 'supertest';
import app from '../index.js';
import { initializeTestDb, insertTestUser, getToken } from '../helpers/test.js';

before(async () => {
    await initializeTestDb();
});

describe('GET /tasks', () => {
    it('should return all tasks', async () => {
        const res = await request(app).get('/tasks');
        res.should.have.status(200);
        res.body.should.be.an('array');
    });
});

describe('POST /tasks', () => {
    let token;

    before(async () => {
        await insertTestUser('test@example.com', 'password');
        token = getToken('test@example.com');
    });

    it('should post a task', async () => {
        const res = await request(app)
            .post('/tasks/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Test Task' });
        res.should.have.status(201);
    });

    it('should not post a task without description', async () => {
        const res = await request(app)
            .post('/tasks/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task' });
        res.should.have.status(400);
    });
});

describe('DELETE /tasks/:id', () => {
    let token;

    before(async () => {
        await insertTestUser('test@example.com', 'password');
        token = getToken('test@example.com');
    });

    it('should delete a task', async () => {
        const res = await request(app)
            .delete('/tasks/delete/1')
            .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
    });

    it('should not delete a task with SQL injection', async () => {
        const res = await request(app)
            .delete('/tasks/delete/1; DROP TABLE users;')
            .set('Authorization', `Bearer ${token}`);
        res.should.have.status(400);
    });
});

describe('POST /register', () => {
    beforeEach(async () => {
        await initializeTestDb();
    });

    it('should register with valid email and password', async () => {
        const res = await request(app)
            .post('/user/register')
            .send({ email: 'newuser@example.com', password: 'password' });
        res.should.have.status(201);
    });
});

describe('POST /login', () => {
    before(async () => {
        await insertTestUser('test@example.com', 'password');
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/user/login')
            .send({ email: 'test@example.com', password: 'password' });
        res.should.have.status(200);
        res.body.should.have.property('token');
    });
});
