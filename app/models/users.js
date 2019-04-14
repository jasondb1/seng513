const mongoose=require('mongoose');
let Schema = mongoose.Schema;
require('mongoose-type-email');
let passportLocalMongoose = require('passport-local-mongoose');

const Users = new Schema({    //mongoose.model('Users', {


    username: {
        type: String,
        unique: true,
        required: [true, 'Username required']
    },

    password: {
        type: String,
        required:  [true, 'Password required']
    },

    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        required:  [true, 'Email required']
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
        required: false,
        default: false
    },

    active: {
        type: Boolean,
        default: true
    }


});

Users.plugin(passportLocalMongoose);

//module.exports = {Users};
module.exports = mongoose.model('Users', Users);
