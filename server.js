"use strict";

const express = require("express");
const sassMiddleware = require('node-sass-middleware');
const app = express();
const { PORT } = process.env;
const path = require('path');
const bodyParser = require("body-parser");
const multer = require("multer");
const imgur = require('imgur');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const MONGODB_URL = "mongodb://localhost:27017/node-webserver"

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

let db;


//set templating engine to jade or something else
app.set("view engine", "jade");

//BASICALLY SERVER GOES HEY LOOK FOR EVERYTHING IN HERE FOR Get REQUESTS

const {outputCal} = require("./lib/monthGen.js");
const {makeYear} = require("./lib/yearGen.js");


//middleware
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    //this is whitespace indent rather than curly braces
    indentedSyntax: true,
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//execute body parser, use body parser -> app.use
app.use(bodyParser.json());
//use extended options
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

//add local vars for render
app.locals.title = "The Super Awesome Cal";


//random route
app.get("/random", (req, res)=>{
    res.end("this is the random route");
});


//brian route
app.get("/brian", (req, res)=>{

    db.collection("test").find().toArray(function(err, docs) {
      console.log("Docs BELOOOOOWWW ------------> ");
      console.log(docs);
      res.send(docs[0].name)

    });
    // console.log(pro);
    // console.log("hay ->>>>>>>>>>>>>>>>>>>>");
    // res.end("this is the random route");
});

//contact
app.get("/contact", (req, res)=>{
    if(req.query.name){
      res.send("<h1>Thanks bruh</h1>");
    }
    res.render("contact");
});

//set app.post for contact form
app.post("/contact", (req, res) => {
  console.log("body ------>");
   console.log(req.body) //you will get your data in this as object.
   //save in db in test collection
   db.collection("test").insertOne({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
   }, (err, response)=>{
    if (err) throw err;
    console.log("hey hey hey ");
    res.send("<h1>Thanks "+req.body.name+"</h1>");
   })
});

// //set app.post for contact form
// app.post("/postthisjunk", (req, res) => {

//   console.log(req);

//   // db.collection("testalot").insertOne(req)
// });

//scott's function for posting and cacheing system
app.get('/api/news/scott', (req, res) => {
    db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {

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

app.get("/sendphoto", (req, res) => {
  res.render("sendphoto");
});

//set app.post for photo
app.post("/sendphoto", upload.single('myimage'), (req, res) => {
  console.log(req.body);
  console.log("file below");
  console.log(req.file);
  res.send("<h1>Thanks for sending us your sweet photo</h1>");
    // send single image
    imgur.uploadFile(req.file.path)
        .then(function (json) {

          let linkObject = {
            link : json.data.link
          }
          //save to mongo
          db.collection("imgurs").insertOne(linkObject, (err, dbResponse) => {
            if (err) throw err;
              console.log("link below boys");
                console.log(json.data.link);
                //remove from uploads
                fs.unlink(req.file.path, ()=>{
                  console.log("File uploaded to imgur and delted from public/uploads");
                });
          })
        })
        .catch(function (err) {
            console.error(err.message);
        });

});

//hello route with params
app.get("/hello", (req, res)=>{

    res.end(`Hello ${req.query.name}`);
});

//month route
app.get("/cal/:year/:month", (req, res)=>{


    let splitArray = outputCal(req.params.month,req.params.year).replace(/ /g, "&nbsp;").split("\n");
    res.status(200).send(`<pre>${splitArray.join("<br>")}</pre>`);

    res.end("Welcome to mah cal");
});

//year route
app.get("/cal/:year", (req, res)=>{

    makeYear(req.params.year);
    res.status(200).send(`<pre>${makeYear(req.params.year).toString()}</pre>`);

    res.end("Welcome to mah cal");
});

//spaz route with Route params
app.get("/spaz/:numOne/:numTwo", (req, res)=>{
  const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  }
    res.end(`${getRandomArbitrary(parseInt(req.params.numOne),parseInt(req.params.numTwo))}`);
});

//default route for cal landing page
app.get("/", (req, res)=>{
    //load index by default --> this wil look for views directory and an index file, since we have index as jade it will generate the html from jade because of our view engine
      res.render("index");
});




/////api routes
app.get("/api", (req, res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.send({"name":"ben"})
});

app.post("/api", (req, res)=>{
  console.log(req.body);
  res.send({"hello":"world"});

});
  //top stories --> get top stories from cnn
app.get("/api/news", (req, res)=>{
    const url = "http://cnn.com";
    request.get(url, (err, response, body )=>{
      if (err) throw err;

      const topStories = [];
      const $ = cheerio.load(body)

      topStories.push({
        title : $(".banner-text").text(),
        url : $(".banner-text").closest("a").attr("href")
      });

      _.range(1,12).forEach(i=>{
        topStories.push({
          title: $(".cd__headline").eq(i).text(),
          url: $(".cd__headline").eq(i).find("a").attr("href")
        });

      });

      res.send(topStories)
    })
});

  //handling cors with request npm, this now works and gets around cors --> my body is already json parsed
app.get("/api/weather", (req, res)=>{
  let url = "https://api.forecast.io/forecast/deddf761abe49ca199f649859b49fc32/35.9851060,-86.6486830";
  request.get(url, (err, response, body )=>{
      res.header('Access-Control-Allow-Origin', "*");
      res.send(body);
  });
});

//catch all route
app.all("*", (req, res)=>{
  //the res.send() is an express function, but the below is the old way
    // res.send(404, "Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!");

  //the new way is
    res.status(404).send("Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!")
});


//Connect to mongo
MongoClient.connect(MONGODB_URL, (err, database)=>{
  if (err) throw err;

  db = database;

  //fire app.listen here
  app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));

})

// app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






