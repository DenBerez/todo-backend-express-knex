exports.up = function (knex) {
    return knex.schema.createTable('projects', function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.string('description');
        table.integer('organization_id').unsigned().notNullable();
        table.string('background_color').defaultTo('#FFFFFF');
        table.boolean('is_archived').defaultTo(false);
        table.timestamps(true, true);

        // Foreign key
        table.foreign('organization_id').references('organizations.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('projects');
}; 