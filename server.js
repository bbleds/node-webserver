"use strict";

const express = require("express");
const app = express();
const { PORT } = process.env;

// http.createServer((req,res) => {

//   if(req.url === "/hello") {

//     const msg = '<h1>Hello World</h1>'
//     res.writeHead(200, {"Content-Type": "text/html"});

//     msg.split("").forEach((char, i)=>{

//       setTimeout(()=>{
//          res.write(char);
//       }, 100*i)
//     });



//   } else if (req.url === "/random"){
//      res.end("<h1>This is so random!!</h1>");
//   } else {
//     res.writeHead(403);
//     res.end("Access Denied!!!")
//   }
// });

//random route
app.get("/random", (req, res)=>{
    res.end("RANNNNDOMMMMMMMMMMMMMMM");
});

//hello route
app.get("/hello", (req, res)=>{
    res.end("Hello worlt");
});

//default route
app.get("/", (req, res)=>{
    res.end("hey hey hey hey");
});

//catch all route
app.all("*", (req, res)=>{
    res.writeHead(404);
    res.end("Page not fount");
});

app.listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






