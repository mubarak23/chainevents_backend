/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("events_attendance", function (table) {
    table.increments("id").primary();
    table.string("event_id").notNullable();
    table.string("user_address").notNullable();
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
  return knex.schema.dropTableIfExists("events_attendance");
};
