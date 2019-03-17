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
const cors = require('cors');
const path = require('path');
const index = require('./app/routes/index');
const auth = require('./app/routes/auth');
const project = require('./app/routes/project');  //used for creating, retrieving, updating and deleting
const invoice = require('./app/routes/invoice');  //used for creating, retrieving, updating and deleting


const port = 3000;

//setup authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//database

// place this middleware before any other route definitions
// makes io available as req.io in all request handlers
// then in any express route handler, you can use req.io.emit(...)
app.use(function(req, res, next) {
    req.io = io;
    next();
});

require('./app/socket.js')(io);

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
app.use(cors()); // Use this after the variable declaration
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('express-session')({
    secret: 'rotten fish',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//routes ===========
app.use('/', index);
app.use('/api/auth', auth);
app.use('/api/project', project);
app.use('/api/invoice', invoice);

// passport config
var Account = require('./app/models/users');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//////////////
//Start server
server.listen(port, () => {
    console.log('listening on port: ' + port);
});