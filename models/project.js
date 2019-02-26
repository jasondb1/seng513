const mongoose=require('mongoose');

const Project = mongoose.model('Project', {

    id: {
        type: Number,
        required: true
    },

    description: {
       type: String,
       required: true
    }

});

module.exports = {Project};
