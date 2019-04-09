const mongoose=require('mongoose');
let Schema = mongoose.Schema;


const invoiceSchema = new Schema({

//id field is created by Auto-increment, starts at 1 for all documents put in.
    description: {
        minlength: 2,
        maxlength: 255,
        type: String,
        required: true
    },

    invoiceDate:{
        type: Date,
        required: true,
        defualt: Date.now
    },

    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },

    status: {
        type: String,
        required: true,
        default: "In Progress"
    },

    totalCost:{
        type: Number,
        required: true,
        default: 0
    }

});



module.exports = mongoose.model("invoiceSchema",invoiceSchema);



