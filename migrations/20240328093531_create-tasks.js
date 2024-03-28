/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.createTable('tasks',function(table){
    table.string('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.string('status').notNullable();
    table.timestamps(true,true);
    table.string('user_id').references('id').inTable('users');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
