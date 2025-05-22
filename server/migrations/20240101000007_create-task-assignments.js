exports.up = function (knex) {
    return knex.schema.createTable('task_assignments', function (table) {
        table.increments('id');
        table.integer('task_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamps(true, true);

        // Foreign keys
        table.foreign('task_id').references('tasks.id').onDelete('CASCADE');
        table.foreign('user_id').references('users.id').onDelete('CASCADE');

        // Composite unique constraint
        table.unique(['task_id', 'user_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('task_assignments');
};

