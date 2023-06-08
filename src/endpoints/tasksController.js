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
    created_at: '2023-06-08T00:00:00.000Z',
    completed_at: null,
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 2,
    name: 'Bericht abschließen',
    created_at: '2023-06-07T00:00:00.000Z',
    completed_at: '2023-06-07T10:30:00.000Z',
    email: 'john.doe@gmail.com',
  },
  {
    id: 3,
    name: 'Laufen gehen',
    created_at: '2023-06-08T00:00:00.000Z',
    completed_at: null,
    email: 'jane.smith@gmail.com',
  },
  {
    id: 4,
    name: 'Ein Buch lesen',
    created_at: '2023-06-06T00:00:00.000Z',
    completed_at: '2023-06-06T15:45:00.000Z',
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 5,
    name: 'Rechnungen bezahlen',
    created_at: '2023-06-09T00:00:00.000Z',
    completed_at: null,
    email: 'john.doe@gmail.com',
  },
  {
    id: 6,
    name: 'Mama anrufen',
    created_at: '2023-06-10T00:00:00.000Z',
    completed_at: null,
    email: 'jane.smith@gmail.com',
  },
  {
    id: 7,
    name: 'Meeting vorbereiten',
    created_at: '2023-06-11T00:00:00.000Z',
    completed_at: null,
    email: 'max.mustermann@gmail.com',
  },
  {
    id: 8,
    name: 'Geburtstagsgeschenk kaufen',
    created_at: '2023-06-12T00:00:00.000Z',
    completed_at: null,
    email: 'john.doe@gmail.com',
  },
  {
    id: 9,
    name: 'Wohnung aufräumen',
    created_at: '2023-06-12T00:00:00.000Z',
    completed_at: null,
    email: 'jane.smith@gmail.com',
  },
  {
    id: 10,
    name: 'Blogpost schreiben',
    created_at: '2023-06-13T00:00:00.000Z',
    completed_at: null,
    email: 'max.mustermann@gmail.com',
  },
];

function isValidTask(task) {
  const {
    name, created_at, completed_at,
  } = task;
  return (
    typeof name === 'string'
    && (created_at == null || typeof created_at === 'string')
    && (completed_at == null || typeof completed_at === 'string')
  );
}

router.use(async (req, res, next) => {
  if (!req.session?.email) return res.status(403).json({ error: 'Unauthorized' }); // 401 would fit more, but not written like that in task
  return next();
});

router.get('/', async (req, res) => {
  const sessionEmail = req.session?.email;

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

  const { name } = req.body;
  if (!name) return res.status(406).json({ error: 'Missing name property' });
  const lastTaskId = parseInt(tasks[tasks.length - 1].id, 10);
  const newTask = {
    id: lastTaskId ? lastTaskId + 1 : 1,
    name,
    created_at: new Date(),
    completed_at: null,
    email: sessionEmail,
  };
  tasks.push(newTask);

  return res.sendStatus(201);
});

router.put('/:id', (req, res) => {
  const sessionEmail = req.session?.email;

  const {
    name, created_at, completed_at,
  } = req.body;
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  const foundTask = tasks[taskIndex];
  if (!foundTask) return res.status(404).json({ error: 'Task not found' });
  if (foundTask.email !== sessionEmail) return res.status(403).json({ error: 'Cannot change a task you do not own' });
  if (!isValidTask(req.body)) return res.status(406).json({ error: 'Missing or wrong body properties' });
  const newTask = {
    id: foundTask.id,
    name,
    created_at,
    completed_at,
    email: foundTask.email,
  };
  tasks[taskIndex] = newTask;

  return res.status(200).json({ newTask });
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
