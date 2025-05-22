const knex = require("./connection.js");

async function all() {
    return knex('organizations');
}

async function get(id) {
    const results = await knex('organizations').where({ id });
    return results[0];
}

async function create(orgData) {
    const results = await knex('organizations').insert(orgData).returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('organizations').where({ id }).update(properties).returning('*');
    return results[0];
}

async function del(id) {
    const results = await knex('organizations').where({ id }).del().returning('*');
    return results[0];
}

// Get all organizations a user belongs to
async function getUserOrganizations(userId) {
    return knex('organizations')
        .join('user_organizations', 'organizations.id', 'user_organizations.organization_id')
        .where('user_organizations.user_id', userId)
        .select('organizations.*', 'user_organizations.role');
}

// Get all users in an organization
async function getOrganizationUsers(orgId) {
    return knex('users')
        .join('user_organizations', 'users.id', 'user_organizations.user_id')
        .where('user_organizations.organization_id', orgId)
        .select('users.*', 'user_organizations.role');
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    getUserOrganizations,
    getOrganizationUsers
} 