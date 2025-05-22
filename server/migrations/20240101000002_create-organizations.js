exports.up = function (knex) {
    return knex.schema.createTable('organizations', function (table) {
        table.increments('id');
        table.string('name').notNullable();
        table.string('description');
        table.string('logo_url');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('organizations');
}; 