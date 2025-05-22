const knex = require("./connection.js");

async function all() {
    return knex('projects');
}

async function get(id) {
    const results = await knex('projects').where({ id });
    return results[0];
}

async function create(projectData) {
    const results = await knex('projects').insert(projectData).returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('projects').where({ id }).update(properties).returning('*');
    return results[0];
}

async function del(id) {
    const results = await knex('projects').where({ id }).del().returning('*');
    return results[0];
}

// Get all projects for an organization
async function getOrgProjects(orgId) {
    return knex('projects').where({ organization_id: orgId });
}

// Archive a project
async function archiveProject(id) {
    const results = await knex('projects')
        .where({ id })
        .update({ is_archived: true })
        .returning('*');
    return results[0];
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    getOrgProjects,
    archiveProject
} 