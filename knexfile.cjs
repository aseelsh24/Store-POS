require('dotenv').config();
const { cfg } = require('./config/index.js');

let connection;

if (cfg.DB_TYPE === 'sqlite') {
  connection = {
    filename: cfg.SQLITE_FILE,
  };
} else if (cfg.DB_TYPE === 'mysql') {
  connection = {
    host: cfg.DB_HOST,
    port: cfg.DB_PORT || 3306,
    database: cfg.DB_NAME,
    user: cfg.DB_USER,
    password: cfg.DB_PASSWORD,
  };
} else if (cfg.DB_TYPE === 'postgres') {
  connection = {
    host: cfg.DB_HOST,
    port: cfg.DB_PORT || 5432,
    database: cfg.DB_NAME,
    user: cfg.DB_USER,
    password: cfg.DB_PASSWORD,
  };
}

module.exports = {
  development: {
    client: cfg.DB_TYPE === 'sqlite' ? 'sqlite3' : cfg.DB_TYPE === 'mysql' ? 'mysql2' : 'pg',
    connection: connection,
    useNullAsDefault: cfg.DB_TYPE === 'sqlite',
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    client: cfg.DB_TYPE === 'sqlite' ? 'sqlite3' : cfg.DB_TYPE === 'mysql' ? 'mysql2' : 'pg',
    connection: connection,
    useNullAsDefault: cfg.DB_TYPE === 'sqlite',
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
