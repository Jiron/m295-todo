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

app.use('/', require('./endpoints/loginController'));
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

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, async () => {
  // needed to know when app is really up and running
  // eslint-disable-next-line no-console
  console.log(`API is now running on port ${PORT}`);
});
