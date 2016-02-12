'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const upload = require('multer')({ dest: 'tmp/uploads' });
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

let db;

app.set('view engine', 'jade');

app.locals.title = 'THE Super Cool App';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
    if (err) throw err;

    res.render('index', {
      date: new Date(),
      topStory: doc.top[0]
    });
  });
});

app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

app.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, val => val.toUpperCase());

  db.collection('allcaps').insertOne(obj, (err, result) => {
    if (err) throw err;

    res.send(result.ops[0]);
  });
});

app.get('/api/weather', (req, res) => {
  const API_KEY = '00c2032f84f5e9393b7a1eda02d49228';
  const url = `https://api.forecast.io/forecast/${API_KEY}/37.8267,-122.423`;

  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

app.get('/api/news', (req, res) => {
  db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
    if (err) throw err;

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });

      db.collection('news').insertOne({ top: news }, (err, result) => {
        if (err) throw err;

        res.send(news);
      });
    });
  });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {

  const obj = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw err;

    console.log(newObj);
    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });

  // db.collection('contact').insertOne(obj, (err, result) => {
  //   if (err) throw err;

  //   res.send(`<h1>Thanks for contacting us ${obj.name}</h1>`);
  // });
});

app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), (req, res) => {
  res.send('<h1>Thanks for sending us your photo</h1>');
});

app.get('/hello', (req, res) => {
  const name = req.query.name || 'World';
  const msg = `<h1>Hello ${name}!</h1>
<h2>Goodbye ${name}!</h2>`;

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  // chunk response by character
  msg.split('').forEach((char, i) => {
    setTimeout(() => {
      res.write(char);
    }, 1000 * i);
  });

  // wait for all characters to be sent
  setTimeout(() => {
    res.end();
  }, msg.length * 1000 + 2000);
});

app.get('/random', (req, res) => {
  res.send(Math.random().toString());
});

app.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;

  res.send(getRandomInt(+min, +max).toString());
});

app.get('/secret', (req, res) => {
  res
    .status(403)
    .send('Access Denied!');
});

mongoose.connect(MONGODB_URL);

const Contact = mongoose.model('contacts', mongoose.Schema({
  name: String,
  email: String,
  message: String
}));

mongoose.connection.on('open', () => {
  console.log('MONGO OPEN');

  // if (err) throw err;

  // db = database;

  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
