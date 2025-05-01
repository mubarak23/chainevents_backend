import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    client: "pg",
    connection: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }, // Optional, ensures SSL with Neon
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;