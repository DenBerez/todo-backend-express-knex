exports.up = function (knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('id');
        table.string('title').notNullable();
        table.text('description');
        table.integer('project_id').unsigned().nullable();
        table.string('status').defaultTo('To Do'); // 'To Do', 'In Progress', 'Cancelled', 'Done'
        table.integer('order');
        table.date('due_date');
        table.boolean('completed').defaultTo(false);
        table.string('priority').defaultTo('medium'); // e.g., 'high', 'medium', 'low'
        table.string('label_color');
        table.timestamps(true, true);

        // Foreign key with onDelete('SET NULL') to allow null values
        table.foreign('project_id').references('projects.id').onDelete('SET NULL');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tasks');
}; 