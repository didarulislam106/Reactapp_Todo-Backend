DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

-- Add some initial test data
INSERT INTO tasks (description) VALUES ('Test task 1');
INSERT INTO tasks (description) VALUES ('Test task 2');
