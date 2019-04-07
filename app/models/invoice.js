const mongoose=require('mongoose');

const Invoice = mongoose.model('Invoice', {

    id: {
        type: Number,
        required: true
    },

    description: {
       type: String,
       required: true
    },

    status: {
        type: String,
        required: true
    },

    started: {
        type: String,
        required: true
    },

    notes: {
        type: String,
        required: true
    }


});

module.exports = {Invoice};
