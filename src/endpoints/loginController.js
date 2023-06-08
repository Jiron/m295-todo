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
const logins = [
  {
    email: 'john.doe@gmail.com', password: fixPassword,
  },
  {
    email: 'max.mustermann@gmail.com', password: fixPassword,
  },
  {
    email: 'jane.smith@gmail.com', password: fixPassword,
  },
];

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const entry = logins.find((x) => email?.toLowerCase() === x.email && password === x.password);

  // Check the credentials against store
  if (entry) {
    // Link email to session
    req.session.email = entry.email;

    return res.status(200).json({ email });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/verify', async (req, res) => {
  const { email } = req.session;

  if (email) {
    return res.status(200).json({ email });
  }

  return res.status(401);
});

router.delete('/logout', async (req, res) => {
  req.session.email = null;
  return res.sendStatus(204);
});

module.exports = router;
