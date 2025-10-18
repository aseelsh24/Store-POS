exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('full_name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('description', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('user_roles', (table) => {
    table.integer('user_id').unsigned().notNullable();
    table.integer('role_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['user_id', 'role_id']);
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('permissions', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.string('resource', 50).notNullable();
    table.string('action', 50).notNullable();
    table.string('description', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('role_permissions', (table) => {
    table.integer('role_id').unsigned().notNullable();
    table.integer('permission_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['role_id', 'permission_id']);
    table.foreign('role_id').references('roles.id').onDelete('CASCADE');
    table.foreign('permission_id').references('permissions.id').onDelete('CASCADE');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('users');
};
