const mongoose=require('mongoose');

const Invoice = mongoose.model('Invoice', {

    id: {
        type: Number,
        required: true
    },

    description: {
       type: String,
       required: true
    }

});

module.exports = {Invoice};
