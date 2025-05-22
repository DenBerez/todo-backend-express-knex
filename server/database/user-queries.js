const knex = require("./connection.js");

async function all() {
    return knex('users');
}

async function get(id) {
    const results = await knex('users').where({ id });
    return results[0];
}

async function getByUsername(username) {
    const results = await knex('users').where({ username });
    return results[0];
}

async function create(userData) {
    const results = await knex('users').insert(userData).returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('users').where({ id }).update(properties).returning('*');
    return results[0];
}

async function del(id) {
    const results = await knex('users').where({ id }).del().returning('*');
    return results[0];
}

module.exports = {
    all,
    get,
    getByUsername,
    create,
    update,
    delete: del
} 