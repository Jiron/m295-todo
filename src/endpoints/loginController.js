// You usually use underscores in json so this is why I removed the eslint check
/* eslint-disable camelcase */
const express = require('express');
const session = require('express-session');

const router = express.Router();

router.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

const fixPassword = 'm295';

function isEmail(email) {
  // Regex so todo users cant add random characters as an email
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) { return true; }

  return false;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check the credentials against store
  if (password === fixPassword && isEmail(email)) {
    // Link email to session
    req.session.email = email;

    return res.status(200).json({ email });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/verify', async (req, res) => {
  const { email } = req.session;

  if (email) {
    return res.status(200).json({ email, logged_in: true });
  }

  return res.status(401).json({ email: null, logged_in: false });
});

router.delete('/logout', async (req, res) => {
  req.session.email = null;
  return res.sendStatus(204);
});

module.exports = router;
