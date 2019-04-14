const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

//the following is for users

//////retrieve all users
router.get('/', (req, res) => {

    User.find({active: true}, (err, users) => {
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
router.get('/:id', (req, res) => {

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
router.post('/', (req, res) => {

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
router.put('/editUser', async (req, res) => {

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
                res.status(400).json(message);
            }
        });
});

//////Delete user
router.delete('/:id', function (req, res) {

    User.findOneAndUpdate({_id: req.params.id}, {active: false }, {new: true, runValidators: true},
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "User Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the user"};
                res.status(400).json(message);
            }
        });
});

module.exports = router;
