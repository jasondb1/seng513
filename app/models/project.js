const mongoose=require('mongoose');

const Project = mongoose.model('Project', {

    id: {
        type: Number,
        required: true
    },

    description: {
       type: String,
       required: true
    },

    dateCreated: {
        type: Date,
        required: true
    },

    employees:[{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],

    projectManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }


});

module.exports = {Project};
