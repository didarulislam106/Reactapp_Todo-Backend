const pool = require('../db');

class User {
    static async selectUserByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        return rows[0];
    }

    static async insertUser(user) {
        const { email, password } = user;
        const [result] = await pool.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, password]);
        return result.insertId;
    }
}

module.exports = User;