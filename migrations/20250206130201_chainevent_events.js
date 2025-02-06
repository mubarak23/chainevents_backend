/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("events", function (table) {
    table.increments("id").primary();
    table.string("name", 255);
    table.string("description", 255)
    table.string("event_onchain_id", 255);
    table.string("location", 255);
    table.string("event_owner", 255);
    table.string("event_email", 255);
    table.boolean("require_approval", bool);
    table.boolean("open_for_registration", bool).defaultTo(true);
    table.string("event_capacity", 255);
    table.string("ticket", 255);
    table.string("event_type", 255); // public or private
    table.string("event_mode", 255); // free for paid
    table.string("ticket_amount", 255).nullable(); // amount per ticket
    table.string("event_start_date", 255).nullable();
    table.string("event_end_date", 255).nullable();
    table.string("event_image_url", 255).nullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("events");
};
