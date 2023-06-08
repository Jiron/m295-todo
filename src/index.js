const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/tasks', require('./endpoints/tasksController'));

const file = fs.readFileSync('swagger_doc.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(session({
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const entry = logins.find((x) => email?.toLowerCase() === x.email && password === x.password);

  // Check the credentials against store
  if (entry && !req.session.email && !req.session.authenticated) {
    // Link email to session
    req.session.email = entry.email;
    req.session.authenticated = true;

    return res.status(200).json({ email });
  }

  return res.sendStatus(403);
});

app.get('/verify', async (req, res) => {
  const { email, authenticated } = req.session;

  if (email && authenticated) {
    return res.status(200).json({ email });
  }

  return res.status(401).json({ error: 'Not logged in' });
});

app.delete('/logout', async (req, res) => {
  if (req.session.authenticated) {
    req.session.email = null;
    req.session.authenticated = false;
  } else {
    return res.status(401).json({ error: 'Not logged in' });
  }

  return res.sendStatus(200);
});

app.listen(PORT, async () => {
  // needed to know when app is really up and running
  // eslint-disable-next-line no-console
  console.log(`API is now running on port ${PORT}`);
});
