const knex = require("./connection.js");

async function all() {
    return knex('tasks');
}

async function get(id) {
    const results = await knex('tasks').where({ id });
    return results[0];
}

async function create(taskData) {
    const results = await knex('tasks').insert(taskData).returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('tasks').where({ id }).update(properties).returning('*');
    return results[0];
}

async function del(id) {
    const results = await knex('tasks').where({ id }).del().returning('*');
    return results[0];
}

// Get all tasks for a project
async function getProjectTasks(projectId) {
    return knex('tasks').where({ project_id: projectId });
}

// Get tasks by status
async function getTasksByStatus(projectId, status) {
    return knex('tasks').where({
        project_id: projectId,
        status: status
    });
}

// Update task status
async function updateStatus(id, status) {
    const results = await knex('tasks')
        .where({ id })
        .update({ status })
        .returning('*');
    return results[0];
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    getProjectTasks,
    getTasksByStatus,
    updateStatus
} 