﻿/*
 * index.js - The node.js server entry point
 *
 *
 *
 *
 *
 */

//setup ===========

require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');             //to access mongo database
const morgan = require('morgan');                 //a logger
const bodyParser = require('body-parser');
const methodOverride = require('method-override');//allows put and delete in some places it is not allowed
const cors = require('cors');
const path = require('path');
const index = require('./app/routes/index');
const auth = require('./app/routes/auth');
const users = require('./app/routes/users');
const project = require('./app/routes/project');  //used for creating, retrieving, updating and deleting
const invoice = require('./app/routes/invoice');  //used for creating, retrieving, updating and deleting
const Chatkit = require('@pusher/chatkit-server');
const port = 3000;

//setup authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const chatkit = new Chatkit.default({
    instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
    key: process.env.CHATKIT_SECRET_KEY,
});

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
app.use(cors({origin:['http://localhost:4200'], credentials: true})); // Use this after the variable declaration
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('express-session')({
    secret: 'rotten fish',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: false, secure: false, maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());
// passport config
var Account = require('./app/models/users');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// app.use( (req, res, next) => {
//     console.log('debug');
//     console.log(req.session.id);
//    console.log(req.session.name);
//    console.log(req.session);
// next();
// });

//routes ===========
app.use('/', index);
app.use('/api/auth', auth);

//method to check if user is logged in.
//everything behind here requires authentication

app.use( function isLoggedIn(req, res, next) {
    console.log(req.session);
    if (req.session.name)
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
});

app.use('/api/users', users);
app.use('/api/project', project);
app.use('/api/invoice', invoice);

//routing 
app.post('/users', (req, res) => {
    const { username } = req.body;

    console.log(req.body);

    chatkit
        .createUser({
            id: username,
            name: username,
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.error === 'services/chatkit/user_already_exists') {
                res.sendStatus(200);
            } else {
                res.status(err.status).json(err);
            }
        });
});

app.post('/authenticate', (req, res) => {
    const authData = chatkit.authenticate({
        userId: req.query.user_id,
    });
    res.status(authData.status).send(authData.body);
});

////////////
// start chat-server
app.set('port', process.env.port || 5200);
//app.set('port', 3000);
const serv = app.listen(app.get('port'), () => {
    console.log(`express running → port ${serv.address().port}`);
});

////////////
//Start server
server.listen(port, () => {
   console.log('listening on port: ' + port);
});


