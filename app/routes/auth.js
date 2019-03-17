const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../models/users');


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});


//the following is for users

///get/display all projects
router.get('/users', (req, res) => {

    User.find( (err, users) => {
        if (!err) {
            res.json(users);
        }
        else {
            console.log("Error retrieving user:" + err);
        }
    });
});


//save project
router.post('/useradd', (req, res) => {

    //construct a new employee
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name_first: req.body.name_first,
        name_last: req.body.name_last
    });

    //TODO: validation and hash password, test if username is unique
    //

    //save into database
    newUser.save( (err, user) => {
        if(err){
            console.log ("Error saving project data:" + err);
        }
        else {
            res.send(user);
        }
    });
});



////The following is for authorization

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
   Users.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { error: err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


module.exports = router;