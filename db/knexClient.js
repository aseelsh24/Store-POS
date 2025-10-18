const knexConfig = require('../knexfile.cjs');
const { cfg } = require('../config/index.js');

const environment = cfg.NODE_ENV || 'development';
const config = knexConfig[environment];

const knex = require('knex')(config);

module.exports = { knex };
