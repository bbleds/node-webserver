"use strict";

const http = require("http");

http.createServer((req,res) => {

console.log(req.method, req.url)
}).listen(3000, ()=> console.log("server listening on port 3000, ya filthy animal"));






