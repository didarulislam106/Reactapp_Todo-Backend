const pool = require('../db');

class Task {
    static async selectAllTasks() {
        const [rows] = await pool.query('SELECT * FROM task');
        return rows;
    }

    static async insertTask(task) {
        const { title, description } = task;
        const [result] = await pool.query('INSERT INTO task (title, description) VALUES (?, ?)', [title, description]);
        return result.insertId;
    }
}

module.exports = Task;