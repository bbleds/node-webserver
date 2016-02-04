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

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


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
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));

//add local vars for render
app.locals.title = "The Super Awesome Cal";


//random route
app.get("/random", (req, res)=>{
    res.end("this is the random route");
});


//random route
app.get("/contact", (req, res)=>{
    if(req.query.name){
      res.send("<h1>Thanks bruh</h1>");
    }
    res.render("contact");
});

//set app.post for contact form
app.post("/contact", (req, res) => {
   console.log(req.body) //you will get your data in this as object.
  res.send("<h1>Thanks "+req.body.name+"</h1>");
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
            console.log(json.data.link);
            //remove from uploads
            fs.unlink(req.file.path, ()=>{
              console.log("File uploaded to imgur and delted from public/uploads");
            });
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

//catch all route
app.all("*", (req, res)=>{
  //the res.send() is an express function, but the below is the old way
    // res.send(404, "Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!");

  //the new way is
    res.status(404).send("Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!")
});

app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






