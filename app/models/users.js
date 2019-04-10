const mongoose=require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

const Users = new Schema({    //mongoose.model('Users', {


    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    name_first: {
        type: String,
        required: false
    },

    name_last: {
        type: String,
        required: false
    },

    admin: {
        type: Boolean,
        required: false
    }


});

Users.plugin(passportLocalMongoose);

//module.exports = {Users};
module.exports = mongoose.model('Users', Users);
