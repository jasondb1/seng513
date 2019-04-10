const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

// ////The following are for authorization
// router.get('/register', function(req, res) {
//     res.render('register', { });
// });
//
//
// //////Register user
// router.post('/register', function(req, res) {
//     Users.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
//         if (err) {
//             return res.render('register', { error: err.message });
//         }
//
//         passport.authenticate('local')(req, res, function () {
//             req.session.save(function (err) {
//                 if (err) {
//                     return next(err);
//                 }
//                 res.redirect('/');
//             });
//         });
//     });
// });

//////login
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});


//////Login
router.post('/login', function(req, res) {

    console.log(req.body);
    //let username = req.body.username;
    let password = req.body.password;

    User.findOne( {'username': req.body.username}, 'username password admin', function (err, users) {

        console.log(users);

        if (err) {
            console.log("Database Error:" + err);
            let message = {status: 'Error', message: "Database Error"};
            res.send(message);

        } else {
            if (users === null){
                let message = {status: 'Error', message: "Username or password is invalid:"};
                res.send(message);
            } else {

                //check if matches req.body.password

                //check password
                // bcrypt
                //     .compare(req.body.password, hash)
                //     .then(res => {
                //         console.log(res);
                //     })
                //     .catch(err => console.error(err.message));

                if(users.password === req.body.password){
                    console.log ('authenticated');

                    message = {status: 'authenticated', username: users.username, admin: users.admin};
                    res.send(message);

                }
                else {
                    let message = {status: 'Error', message: "Username or password is invalid:"};
                    res.send(message);
                }
            }

        }

    });


    // User.findOne({ username: req.body.username }, 'username password', function (err, user) {
    //
    //     console.log(user);
    //
    //     if (err) {
    //         console.log("Error user doesn't exist." + err);
    //         let message = {status: 'Error', message: "Invalid username or password."};
    //         res.send(message);
    //
    //     } else {
    //
    //         console.log("user exists - check password");
    //         console.log(user);
            //check if matches req.body.password

            //check password
            // bcrypt
            //     .compare(req.body.password, hash)
            //     .then(res => {
            //         console.log(res);
            //     })
            //     .catch(err => console.error(err.message));
    //
    //     }
    //
    // });

    //authenticate???
    //passport.authenticate('local'),

});


//////Logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


//////Just a test to see if connection is working
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


//the following is for users

//////retrieve all users
router.get('/users', (req, res) => {

    User.find( (err, users) => {
        let temp_users = [];

        if (!err) {
            //remove passwords from being sent
       // for (let i = 0; i < users.length; i++ ){
            for (i of users){
                temp_user = JSON.stringify((i));
                temp_user = JSON.parse(temp_user);
                delete temp_user['password'];
                temp_users.push(temp_user);
        }
            res.json(users);
        }
        else {
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
        if(err){
            console.log ("Error retrieving user:" + err);
            let message = {status: 'Error', message: "Cannot Retrieve User!"};
            res.json(message);
        }
        else {

            delete user.password;

            res.send(user);
        }
    });

});

//add user
router.post('/users', (req, res) => {

    console.log(req.body);
    //construct a new employee
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name_first: req.body.name_first,
        name_last: req.body.name_last,
        admin: req.body.admin
    });

    //TODO: validation and hash password, test if username is unique etc, (mongo should check unique)
    //

    bcrypt
        .hash(newUser.password, 10)
        .then(hash => {
            console.log(`Hash: ${hash}`);

            newUser.password = hash;
            // Store hash in your password DB.
        })
        .catch(err => console.error(err.message));

    //save into database
    newUser.save( (err, user) => {
        if(err){
            let message = {status: 'Error', message: 'User could not be entered:' + err};
            console.log ("Error saving project data:" + err);
            res.json(message);
        }
        else {
            let message = {status: 'Success', message: "New User Added"};
            res.json(message);
        }
    });
});

//////edit user
router.put('/users/editUser', async (req, res) => {

   // console.log(req);
    console.log('[Edit User]');
    //params is ID followed, OKAY I GET
    console.log(req.body._id)

    //TODO hash password

    const user = await User.findByIdAndUpdate(req.body._id,
        {
            title: req.body.title,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            name_first: req.body.name_first,
            admin: req.body.admin,
        });

    console.log(user);
    if (!user) return res.status(404).send('User Does not exist');

    res.send(user);

});

//////Delete user
router.delete('/users/:id', function(req, res) {

    User.remove({_id: req.params.id}, (err, result) => {
        if(err) {
            let message = {status: 'Error', message: ("There was a problem deleting the user - " + err)};
            //res.json(err);
            res.json(message);
        }
        else {
            let message = {status: 'Success', message: "User Deleted"};
            res.json(message);
            //res.json(result);
        }
    });
});


module.exports = router;
