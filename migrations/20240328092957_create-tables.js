/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =  async function(knex) {
  return await knex.schema.createTable('users',function (table) {
    table.string('id').primary();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps(true,true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
