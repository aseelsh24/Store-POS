const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { knex } = require('../db/knexClient');
const { cfg } = require('../config/index');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many login attempts, please try again later',
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await knex('users').where({ email: email.toLowerCase() }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is disabled' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userRoles = await knex('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where('user_roles.user_id', user.id)
      .select('roles.name');

    const roles = userRoles.map((r) => r.name);

    const userPermissions = await knex('role_permissions')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .whereIn(
        'role_permissions.role_id',
        userRoles.map((r) => r.id)
      )
      .select('permissions.name');

    const permissions = userPermissions.map((p) => p.name);

    const token = jwt.sign(
      {
        uid: user.id,
        email: user.email,
        fullName: user.full_name,
        roles: roles,
        permissions: permissions,
      },
      cfg.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        roles: roles,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, cfg.JWT_SECRET);
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'An error occurred during token verification' });
  }
});

module.exports = router;
