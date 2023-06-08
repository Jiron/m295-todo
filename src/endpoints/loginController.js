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
];

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const entry = logins.find((x) => email?.toLowerCase() === x.email && password === x.password);

  // Check the credentials against store
  if (entry && !req.session?.email) {
    // Link email to session
    req.session.email = entry.email;

    return res.status(200).json({ email });
  }

  return res.status(403).json({ error: 'Invalid credentials' });
});

router.get('/verify', async (req, res) => {
  const { email } = req.session;

  if (email) {
    return res.status(200).json({ email });
  }

  return res.status(401).json({ error: 'Not logged in' });
});

router.delete('/logout', async (req, res) => {
  if (req.session.email) {
    req.session.email = null;
  } else {
    return res.status(401).json({ error: 'Not logged in' });
  }

  return res.sendStatus(200);
});

module.exports = router;
