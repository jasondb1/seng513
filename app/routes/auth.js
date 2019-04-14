const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

//////login
router.get('/login', function (req, res) {
    res.render('login', {user: req.user});
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


//////Logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


//////Just a test to see if connection is working
router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});


//the following is for users

//////retrieve all users
router.get('/users', (req, res) => {

    User.find((err, users) => {
        let temp_users = [];

        if (!err) {
            //remove passwords from being sent
            for (i of users) {
                temp_user = JSON.stringify((i));
                temp_user = JSON.parse(temp_user);
                delete temp_user['password'];
                temp_users.push(temp_user);
            }
            res.json(temp_users);
        } else {
            console.log("Error retrieving users:" + err);
            let message = {status: 'Error', message: "Cannot Retrieve Users!"};
            res.send(message);
        }
    });
});

//////Retrieve a single project
router.get('/users/:id', (req, res) => {

    //check if id exists in db
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('No record matches id: ' + req.params.id);

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log("Error retrieving user:" + err);
            let message = {status: 'Error', message: "Cannot Retrieve User!"};
            res.json(message);
        } else {

            delete user.password;

            res.send(user);
        }
    });

});

//add user
router.post('/users', (req, res) => {

    //construct a new employee
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name_first: req.body.name_first,
        name_last: req.body.name_last,
        admin: req.body.admin
    });

    hashed_pword = bcrypt
        .hash(newUser.password, 10)
        .then(hash => {
            newUser['password'] = hash;

            //save into database
            newUser.save((err, user) => {
                if (err) {
                    let message = {status: 'Error', message: 'User could not be entered:' + err};
                    console.log("Error saving project data: " + err);
                    res.status(400).json(message);
                } else {
                    let message = {status: 'Success', message: "New User Added"};
                    res.json(message);
                }
            });
        })
        .catch(err => console.error(err.message));

});

//////edit user
router.put('/users/editUser', async (req, res) => {

    //if password is not blank, hash the new password
    if (req.body.password != null) {
        req.body.password = bcrypt.hashSync('myPassword', 10);
    }

    //update the user document
    User.findOneAndUpdate({_id: req.body._id}, {$set: req.body}, {new: true, runValidators: true},
        (err, response) => {

            delete res.password;

            if (!err) {
                let message = {status: 'Success', message: "User Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the user"};
                res.stauts(400).json(message);
            }
        });
});

//////Delete user
router.delete('/users/:id', function (req, res) {

    User.remove({_id: req.params.id}, (err, result) => {
        if (err) {
            let message = {status: 'Error', message: ("There was a problem deleting the user - " + err)};
            res.json(message);
        } else {
            let message = {status: 'Success', message: "User Deleted"};
            res.json(message);
        }
    });
});


module.exports = router;
