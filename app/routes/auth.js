const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.get('/', function (req, res) {
    res.redirect('/');
});

//////login
router.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

//////login
router.get('/logout', function (req, res) {
    req.logOut();
    req.session.destroy((err) => {
        if (err){
            res.status(500).send('Cannot log out!');
        } else {
            res.status(200).send({});
        }
    });
});

//////Login
router.post('/login', function (req, res) {

    User.findOne({'username': req.body.username}, 'username password admin', function (err, users) {
        if (err) {
            console.log("Database Error:" + err);
            let message = {status: 'Error', message: "Database Error"};
            res.send(message);

        } else {
            if (users === null) {
                let message = {status: 'Error', message: "Username or password is invalid:"};
                res.send(message);
            } else {

                //check password
                bcrypt
                    .compare(req.body.password, users.password)
                    .then(isAuthenticated => {
                        if (isAuthenticated) {
                            req.session.name = users.username;
                            message = {status: 'authenticated', username: users.username, admin: users.admin};
                            res.send(message);
                        } else {
                            let message = {status: 'Error', message: "Username or password is invalid:"};
                            res.send(message);
                        }
                    })
                    .catch(err => console.error(err.message));
            }
        }
    });
});

//////Just a test to see if connection is working
router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});




module.exports = router;
