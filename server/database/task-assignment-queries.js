const knex = require("./connection.js");

async function assignTask(taskId, userId) {
    const results = await knex('task_assignments')
        .insert({
            task_id: taskId,
            user_id: userId
        })
        .returning('*');
    return results[0];
}

async function unassignTask(taskId, userId) {
    const results = await knex('task_assignments')
        .where({
            task_id: taskId,
            user_id: userId
        })
        .del()
        .returning('*');
    return results[0];
}

// Get all users assigned to a task
async function getTaskAssignees(taskId) {
    return knex('users')
        .join('task_assignments', 'users.id', 'task_assignments.user_id')
        .where('task_assignments.task_id', taskId)
        .select('users.*');
}

// Get all tasks assigned to a user
async function getUserTasks(userId) {
    return knex('tasks')
        .join('task_assignments', 'tasks.id', 'task_assignments.task_id')
        .where('task_assignments.user_id', userId)
        .select('tasks.*');
}

module.exports = {
    assignTask,
    unassignTask,
    getTaskAssignees,
    getUserTasks
} 