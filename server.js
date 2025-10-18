require('dotenv').config();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { cfg } = require('./config/index');

const app = express();
const server = http.createServer(app);

const PORT = cfg.APP_PORT || 8001;

console.log('Server starting...');
console.log(`Environment: ${cfg.NODE_ENV}`);
console.log(`Database: ${cfg.DB_TYPE}`);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization,X-Access-Token');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.json({
    name: 'Store POS API',
    version: '0.1.0',
    status: 'online',
  });
});

app.use('/api/setup', require('./api/setup'));
app.use('/api/auth', require('./api/auth'));
app.use('/api/inventory', require('./api/inventory'));
app.use('/api/customers', require('./api/customers'));
app.use('/api/categories', require('./api/categories'));
app.use('/api/settings', require('./api/settings'));
app.use('/api/users', require('./api/users'));
app.use('/api', require('./api/transactions'));

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
