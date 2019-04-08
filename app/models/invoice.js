const mongoose=require('mongoose');
let Schema = mongoose.Schema;


const invoice = new Schema({

//id field is created by Auto-increment, starts at 1 for all documents put in.
    description: {
        minlength: 2,
        maxlength: 255,
        type: String,
        required: true
    },

    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },

    status: {
        type: String,
        required: true,
    },

});



module.exports = mongoose.model("invoice",invoice);



