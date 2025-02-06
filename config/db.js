import dotenv from "dotenv";
import knex from "knex";
import config from "./../knexfile.js";
dotenv.config();

const db = knex(config[process.env.NODE_ENV]);

export default db;