/*
 * index.js - The node.js server entry point
 *
 *
 *
 *
 *
 */

//setup ===========
const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');             //to access mongo database
const morgan = require('morgan');                 //a logger
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');//allows put and delete in some places it is not allowed
const io = require('socket.io')(server);          //for realtime communication
const path = require('path');
const index = require('./routes/index');
const project = require('./routes/project');  //used for creating, retrieving, updating and deleting
const invoice = require('./routes/invoice');  //used for creating, retrieving, updating and deleting

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const configureExpress = require('./config/express');   //create the Express app from configure folder
const Capp = configureExpress();                        //create object to 

const port = 3100;
//database

// place this middleware before any other route definitions
// makes io available as req.io in all request handlers
// then in any express route handler, you can use req.io.emit(...)
app.use(function (req, res, next) {
    req.io = io;
    next();
});

require('./app/socket.js')(io);

mongoose.connect('mongodb://group2:smallf1sh@ds129625.mlab.com:29625/small_fish', { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb @ 29625');
});

mongoose.connection.on('error', (err) => {
    console.error('Error in database connection:' + err);
});

//stack ===========
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/test')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(methodOverride());


//routes ===========
app.use('/', index);
app.use('/api/project', project);
app.use('/api/invoice', invoice);


//////////////
//Start server
server.listen(port, () => {
    console.log('listening on port: ' + port);
});


//Start Application 
//process.env.NODE_ENV = process.env.NODE_ENV || 'development';
Capp.listen(3000);
module.exports = Capp;
console.log('Server running at http://localhost:3000/');

