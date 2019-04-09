const mongoose=require('mongoose');
let Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Users} = require('./users');
//const {invoiceSchema} = require('./invoice');

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






const Project = new Schema({

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

    employees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],

    status:{
      type: String
    },

    testing:[{
        type: String
    }],

    projectManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    invoice: [invoiceSchema],

    purchaseOrder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchaseOrder'
    }


});




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


Project.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model("Project",Project);



