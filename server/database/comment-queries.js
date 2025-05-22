const knex = require("./connection.js");

async function getTaskComments(taskId) {
    return knex('comments')
        .where({ task_id: taskId })
        .orderBy('created_at', 'asc');
}

async function get(id) {
    const results = await knex('comments').where({ id });
    return results[0];
}

async function create(commentData) {
    const results = await knex('comments').insert(commentData).returning('*');
    return results[0];
}

async function update(id, content) {
    const results = await knex('comments')
        .where({ id })
        .update({ content })
        .returning('*');
    return results[0];
}

async function del(id) {
    const results = await knex('comments').where({ id }).del().returning('*');
    return results[0];
}

module.exports = {
    getTaskComments,
    get,
    create,
    update,
    delete: del
} 