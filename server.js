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
const mongoose = require('mongoose');             //to access mongo database
const morgan = require('morgan');                 //a logger
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');//allows put and delete in some places it is not allowed
const server = require('http').Server(app);
const io = require('socket.io')(server);          //for realtime communication
const path = require('path');
const index = require('./routes/index');
const project = require('./routes/project');  //used for creating, retrieving, updating and deleting
const invoice = require('./routes/invoice');  //used for creating, retrieving, updating and deleting


const port = 3000;

//database
mongoose.connect('mongodb://group2:smallf1sh@ds129625.mlab.com:29625/small_fish', {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb @ 29625');
} );

mongoose.connection.on('error', (err) => {
    console.error('Error in database connection:' + err);
} );

//stack ===========
app.use(express.static(path.join(__dirname, '/public')));
//app.use(express.static(path.join(__dirname, '/test')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());


//routes ===========
app.use('/', index);
app.use('/api/project', project);
app.use('/api/invoice', invoice);

//sockets
require('./app/socket.js')(io);

///////////////////////////////////////////////////////////////////////
//start Server
//listen (start app with node server.js
app.listen(port);
console.log("App listening on port: " + port);
