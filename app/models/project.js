const mongoose=require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

ProjectSchema = mongoose.Schema({

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
        required: true,
        default: Date.now
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

mongoose.model("Project",ProjectSchema);

ProjectSchema.plugin(AutoIncrement, {inc_field: 'id'});


module.exports = {ProjectSchema};
