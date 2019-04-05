const mongoose=require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Project = mongoose.model("Project", new mongoose.Schema({


    id: {
        type: Number,
        required: true
    },

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

    employees:[{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],



    projectManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    invoice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'invoice'
    },

    purchaseOrder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchaseOrder'
    }


}));


async function addEmployee(projectId, employeeID){
    const project= await Project.findById(projectId);
    project.employees.push(employeeID);
    project.save();
}

async function removeEmployee(projectId, employeeID){
    const project= await Project.findById(projectId);
    const employee = project.employees.id(employeeID);
    employee.remove();
    project.save();
}

async function addPurchaseOrder(projectId, employeeID){

}

async function removePurchaseOrder(projectId, employeeID){

}

async function addPurchaseOrder(projectId, employeeID){

}





ProjectSchema.plugin(AutoIncrement, {inc_field: 'id'});


exports.Project = Project;
exports.validate = validateCustomer;

module.exports = {Project};
