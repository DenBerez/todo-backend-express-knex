exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('username').notNullable().unique();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.string('full_name');
        table.string('avatar_url');
        table.timestamps(true, true); // Adds created_at and updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
}; 