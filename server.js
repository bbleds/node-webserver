"use strict";

const express = require("express");
const app = express();
const { PORT } = process.env;

//set templating engine to jad or something else
app.set("view engine", "jade");

const {outputCal} = require("./lib/monthGen.js");
const {makeYear} = require("./lib/yearGen.js");

console.log(outputCal(3,2016));


//random route
app.get("/random", (req, res)=>{
    res.end("this is the random route");
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

//default route
app.get("/", (req, res)=>{
    //load index by default --> this wil look for views directory and an index file, since we have index as jade it will generate the html from jade because of our view engine
    res.render("index", {
      title: "Super Cool App",
      date: new Date()
    });
});

//catch all route
app.all("*", (req, res)=>{
  //the res.send() is an express function, but the below is the old way
    // res.send(404, "Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!");

  //the new way is
    res.status(404).send("Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!")
});

app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






