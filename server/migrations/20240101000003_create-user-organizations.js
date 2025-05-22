exports.up = function (knex) {
    return knex.schema.createTable('user_organizations', function (table) {
        table.increments('id');
        table.integer('user_id').unsigned().notNullable();
        table.integer('organization_id').unsigned().notNullable();
        table.string('role').defaultTo('member'); // e.g., 'admin', 'member'
        table.timestamps(true, true);

        // Foreign keys
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.foreign('organization_id').references('organizations.id').onDelete('CASCADE');

        // Composite unique constraint
        table.unique(['user_id', 'organization_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_organizations');
}; 