/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("events_registrations", function (table) {
    table.increments("id").primary();
    table.string("event_id").notNullable();
    table.string("user_address").notNullable();
    table.string("email_address").notNullable(false);
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);

    // Composite unique constraint
    table.unique(["event_id", "user_address"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("events_registrations");
};
