const Task = require('../models/Task');
const ApiError = require('../helpers/ApiError');

class TaskController {
    static async getTasks(req, res, next) {
        try {
            const tasks = await Task.selectAllTasks();
            res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    }

    static async postTask(req, res, next) {
        try {
            const { title, description } = req.body;
            if (!title || !description) {
                throw new ApiError('Title and description are required', 400);
            }
            const taskId = await Task.insertTask({ title, description });
            res.status(201).json({ id: taskId, title, description });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TaskController;