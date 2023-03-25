require("dotenv").config();
const {DB_PORT,DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME,DB_DILALECT } = process.env
  module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port : DB_PORT,
    dialect: DB_DILALECT
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port : DB_PORT,
    dialect: DB_DILALECT
  }
}