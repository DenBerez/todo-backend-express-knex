exports.up = function (knex) {
    return knex.schema.createTable('comments', function (table) {
        table.increments('id');
        table.text('content').notNullable();
        table.integer('task_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamps(true, true);

        // Foreign keys
        table.foreign('task_id').references('tasks.id').onDelete('CASCADE');
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('comments');
}; 