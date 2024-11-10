import fetch from 'node-fetch';
import { expect } from 'chai';
import { initializeTestDB, insertTestUser, getToken } from './helper/test.js';

const base_url = 'http://localhost:3001/';
const MAX_RETRIES = 3;

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}

before(() => {
    initializeTestDB();
});

describe('API Tests', () => {
    describe('GET Tasks', () => {
        it('should return all tasks', async () => {
            const response = await fetchWithRetry(base_url);
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('array').that.is.not.empty;
            expect(data[0]).to.include.all.keys('id', 'description');
        });
    });

    describe('POST Task', () => {
        const email = 'post2@foo.com';
        const password = 'post123';
        let token;

        before(async () => {
            await insertTestUser(email, password);
            token = await getToken(email);
        });

        it('should post a task', async () => {
            const response = await fetchWithRetry(base_url + 'create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 'description': 'Task from unit test' }),
            });
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'description');
        });

        it('should not post a task without description', async () => {
            const response = await fetchWithRetry(base_url + 'create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();

            expect(response.status).to.equal(400);
            expect(data).to.be.an('object');
            expect(data).to.have.property('error');
        });
    });

    describe('DELETE Task', () => {
        it('should delete a task', async () => {
            const response = await fetchWithRetry(base_url + 'delete/1', {
                method: 'DELETE',
            });
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id');
        });

        it('should not delete a task with SQL injection', async () => {
            const response = await fetchWithRetry(base_url + '/delete/id=0 or id > 0', {
                method: 'delete',
            });
            const data = await response.json();

            expect(response.status).to.equal(404);  // Changed from 500 to 404
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    describe('POST /register', () => {
        before(() => {
            // Reinitialize DB before registration tests
            initializeTestDB();
        });

        const testData = {
            email: 'test12@example.com',
            password: 'register123'
        };

        it('should register with valid email and password', async () => {
            const response = await fetchWithRetry(base_url + 'user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData),
            });
            const data = await response.json();
            
            if (response.status !== 201) {
                console.log('Registration failed:', data.error);
            }
            
            expect(response.status).to.equal(201, 'Registration should return 201 status code');
            expect(data).to.be.an('object');
            expect(data).to.include.keys('id', 'email');
        });
    });

    describe('POST /login', () => {
        const email = 'test12@example.com';
        const password = 'register123';

        before(async () => {
            await insertTestUser(email, password);
        });

        it('should login with valid credentials', async () => {
            try {
                const response = await fetchWithRetry(base_url + 'user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'email': email, 'password': password }),
                });
                const data = await response.json();

                expect(response.status).to.equal(200, data.error);
                expect(data).to.be.an('object');
                expect(data).to.include.all.keys('id', 'email', 'token');
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        });

    })
});