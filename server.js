"use strict";

const http = require("http");
const { PORT } = process.env;

http.createServer((req,res) => {

  if(req.url === "/hello") {

    const msg = '<h1>Hello World</h1>'
    res.writeHead(200, {"Content-Type": "text/html"});

    msg.split("").forEach((char, i)=>{

      setTimeout(()=>{
         res.write(char);
      }, 100*i)
    });



  } else if (req.url === "/random"){
     res.end("<h1>This is so random!!</h1>");
  } else {
    res.writeHead(403);
    res.end("Access Denied!!!")
  }

console.log(req.method, req.url)
}).listen(PORT, ()=> console.log(`server listening on port ${PORT}, ya filthy animal`));






