const express = require('express');
const bcrypt = require('bcrypt');
const { knex } = require('../db/knexClient');

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const result = await knex('users').count('* as count').first();
    const count = parseInt(result.count, 10);
    res.json({ needsSetup: count === 0 });
  } catch (error) {
    console.error('Error checking setup status:', error);
    res.status(500).json({ message: 'Failed to check setup status' });
  }
});

router.post('/initialize', async (req, res) => {
  try {
    const result = await knex('users').count('* as count').first();
    const count = parseInt(result.count, 10);

    if (count > 0) {
      return res.status(409).json({ message: 'System already initialized' });
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    if (password.length < 10) {
      return res.status(400).json({
        message: 'Password must be at least 10 characters long',
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const hash = await bcrypt.hash(password, 12);

    const ownerRole = await knex('roles').where({ name: 'OWNER' }).first();
    if (!ownerRole) {
      return res.status(500).json({ message: 'Owner role not found. Please run database seeds.' });
    }

    const [userId] = await knex('users').insert({
      full_name: fullName,
      email: email.toLowerCase(),
      password_hash: hash,
      is_active: true,
    });

    const insertId = userId.id || userId;

    await knex('user_roles').insert({
      user_id: insertId,
      role_id: ownerRole.id,
    });

    res.status(201).json({
      ok: true,
      message: 'System initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing system:', error);
    res.status(500).json({ message: 'Failed to initialize system' });
  }
});

module.exports = router;
