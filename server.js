"use strict";

const express = require("express");
const app = express();
const { PORT } = process.env;


//random route
app.get("/random", (req, res)=>{
    res.end("this is the random route");
});

//hello route with params
app.get("/hello", (req, res)=>{

    res.end(`Hello ${req.query.name}`);
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
    res.end("hey hey hey hey");
});

//catch all route
app.all("*", (req, res)=>{
  //the res.send() is an express function, but the below is the old way
    // res.send(404, "Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!");

  //the new way is
    res.status(404).send("Uhm, excuse me, this isn't the page you're looking for, in fact it doesn't exist!!!")
});

app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






