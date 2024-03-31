const http = require('http');
const app = require('./app');

//To set port from env
const port = process.env.PORT || 3000;

//Create the listener
const server = http.createServer(app);

server.listen(port);
