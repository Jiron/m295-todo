const express = require('express');

const router = express.Router();

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

router.get('/', async (req, res) => {
  const email = req.session?.email;

  if (email) {
    return res.status(200).send(tasks.filter((task) => task.email === email));
  }

  return res.sendStatus(401);
});

router.get('/:id', (req, res) => {

});

router.post('/', async (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.patch('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;
