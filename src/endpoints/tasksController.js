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

const tasks = [
  {
    id: 1,
    name: 'Lebensmittel einkaufen',
    date_created: '2023-06-08',
    done: false,
    tags: ['Einkauf', 'Lebensmittel'],
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 2,
    name: 'Bericht abschließen',
    date_created: '2023-06-07',
    done: true,
    tags: ['Arbeit', 'Berichte'],
    email: 'john.doe@gmail.com',
  },
  {
    id: 3,
    name: 'Laufen gehen',
    date_created: '2023-06-08',
    done: false,
    tags: ['Fitness', 'Gesundheit', 'Outdoor'],
    email: 'jane.smith@gmail.com',
  },
  {
    id: 4,
    name: 'Ein Buch lesen',
    date_created: '2023-06-06',
    done: true,
    tags: ['Lesen'],
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 5,
    name: 'Rechnungen bezahlen',
    date_created: '2023-06-09',
    done: false,
    tags: ['Finanzen', 'Rechnungen'],
    email: 'john.doe@gmail.com',
  },
  {
    id: 6,
    name: 'Mama anrufen',
    date_created: '2023-06-10',
    done: false,
    tags: ['Familie'],
    email: 'jane.smith@gmail.com',
  },
  {
    id: 7,
    name: 'Meeting vorbereiten',
    date_created: '2023-06-11',
    done: false,
    tags: ['Arbeit', 'Meeting'],
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 8,
    name: 'Geburtstagsgeschenk kaufen',
    date_created: '2023-06-12',
    done: false,
    tags: ['Geschenk', 'Geburtstag'],
    email: 'john.doe@gmail.com',
  },
  {
    id: 9,
    name: 'Wohnung aufräumen',
    date_created: '2023-06-12',
    done: false,
    tags: ['Haushalt'],
    email: 'jane.smith@gmail.com',
  },
  {
    id: 10,
    name: 'Blogpost schreiben',
    date_created: '2023-06-13',
    done: false,
    tags: ['Schreiben', 'Blog'],
    email: 'max.mustermann@gmail.com',
  },
];

function isValidTask(body) {
  const {
    name, date_created, done, tags,
  } = body;
  return (
    (typeof name !== 'string')
    || (typeof date_created !== 'string')
    || (typeof done !== 'boolean')
    || (typeof tags !== 'object')
  );
}

router.use(async (req, res, next) => {
  if (!req.session?.email) return res.status(401).json({ error: 'Unauthorized' });
  return next();
});

router.get('/', async (req, res) => {
  const sessionEmail = req.session?.email;

  if (!sessionEmail) return res.status(401).json({ error: 'Unauthorized' });

  return res.set('Content-Type', 'application/json').status(200).send(tasks.filter((task) => task.email === sessionEmail));
});

router.get('/:id', async (req, res) => {
  const sessionEmail = req.session?.email;
  const id = parseInt(req.params.id, 10);

  const foundTask = tasks.find((t) => t.email === sessionEmail && t.id === id);

  if (!foundTask) return res.status(404).json({ error: 'Task not found' });

  return res.set('Content-Type', 'application/json').status(200).send(foundTask); // or just .status(200).json(...)
});

router.post('/', (req, res) => {
  const sessionEmail = req.session?.email;

  const {
    name, date_created, done, tags,
  } = req.body;
  if (isValidTask(req.body)) {
    return res.status(422).json({ error: 'Missing or wrong body parameters' });
  }
  const lastTaskId = parseInt(tasks[tasks.length - 1].id, 10);
  const newTask = {
    id: lastTaskId ? lastTaskId + 1 : 1,
    name,
    date_created,
    done,
    tags,
    email: sessionEmail,
  };
  tasks.push(newTask);

  return res.sendStatus(201);
});

router.put('/:id', (req, res) => {
  const sessionEmail = req.session?.email;

  const {
    name, date_created, done, tags,
  } = req.body;
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  const foundTask = tasks[taskIndex];
  if (!foundTask) return res.status(404).json({ error: 'Task not found' });
  if (foundTask.email !== sessionEmail) return res.status(403).json({ error: 'Cannot change a task you do not own' });
  if (!isValidTask(req.body)) return res.status(422).json({ error: 'Missing or wrong body parameters' });
  const newTask = {
    id: foundTask.id,
    name,
    date_created,
    done,
    tags,
    email: foundTask.email,
  };
  tasks[taskIndex] = newTask;

  return res.sendStatus(200);
});

router.delete('/:id', (req, res) => {
  const sessionEmail = req.session?.email;

  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  const foundTask = tasks[taskIndex];

  if (!foundTask) return res.status(404).json({ error: 'Task not found' });
  if (foundTask.email !== sessionEmail) return res.status(403).json({ error: 'Cannot delete a task you do not own' });

  tasks.splice(taskIndex, 1);

  return res.sendStatus(200);
});

module.exports = router;
