const knex = require("./connection.js");

async function addUserToOrg(userId, orgId, role = 'member') {
    const results = await knex('user_organizations')
        .insert({
            user_id: userId,
            organization_id: orgId,
            role
        })
        .returning('*');
    return results[0];
}

async function updateUserRole(userId, orgId, role) {
    const results = await knex('user_organizations')
        .where({
            user_id: userId,
            organization_id: orgId
        })
        .update({ role })
        .returning('*');
    return results[0];
}

async function removeUserFromOrg(userId, orgId) {
    const results = await knex('user_organizations')
        .where({
            user_id: userId,
            organization_id: orgId
        })
        .del()
        .returning('*');
    return results[0];
}

async function getUserOrgRole(userId, orgId) {
    const results = await knex('user_organizations')
        .where({
            user_id: userId,
            organization_id: orgId
        });
    return results[0];
}

module.exports = {
    addUserToOrg,
    updateUserRole,
    removeUserFromOrg,
    getUserOrgRole
} 