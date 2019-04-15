const express = require('express');
const router = express.Router();
let ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Project = require('../models/project');
const User = require('../models/users');


///////////////////////////////////////////////////////////
//Projects

///get/display all projects
router.get('/', function (req, res) {

    Project.find((err, projects) => {
        if (!err) {
            res.json(projects);
        } else {
            console.log("Error retrieving project:" + err);
        }

    });
});

/////////////////////
//save project
router.post('/', function (req, res) {

    //construct a new project
    let newProject = new Project({
        description: req.body.description,
        id: req.body.id,
        dateCreated: req.body.dateCreated,
        employees: req.body.employees,
        projectManager: req.body.projectManager,
        status: req.body.status
    });

    //save into database
    newProject.save((err, project) => {
        if (err) {
            let message = {status: 'Error', message: 'Project Could Not Be Added:' + err};
            console.log("Error saving project data:" + err);
            res.json(message);
        } else {
            let message = {status: 'Success', message: "New Project Added"};
            res.json(message);
        }

    });
});


////////////////////////////////////////
// Get list of projects
router.get('/:user/', async (req, res) => {

    let user = req.params.user;

    //get the user
    usr = await User.findOne({username: user}, (err, tempuser) => {
        if (!err) {
            return tempuser._id;
        }
    });

    let filter = {};
    if (usr.admin !== true) {
        filter = {"employees": ObjectId(usr._id)};
    }
    Project.find(filter, (err, projects) => {

        if (err) {
            console.log("Error loading project data:" + err);
        } else {
            res.send(projects);
        }
    });
});

////////////////////////
//delete project
router.delete('/:id', function (req, res) {

    Project.remove({_id: req.params.id}, (err, result) => {
        if (err) {
            let message = {status: 'Error', message: ("There was a problem deleting the project - " + err)};
            res.json(message);
        } else {
            let message = {status: 'Success', message: "Project Deleted"};
            res.json(message);
        }
    });
});

/////////////////////
//edit Project
router.put('/editProject', async (req, res) => {

    //update the project
    Project.findOneAndUpdate({_id: req.body._id}, {$set: req.body}, {new: true, runValidators: true},
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Project Edited"};
                res.json(message);

            } else {
                console.log(err);
                let message = {status: 'Error', message: "There was an issue editing the Project"};
                res.status(400).json(message);
            }
        });
});

////////////////////////////
//delete Invoice
router.delete('/invoice/:id', async function (req, res) {

    filter = {"invoice._id": ObjectId(req.params.id)};

    Project.updateOne(filter,
        { $pull: {"invoice": {_id: ObjectId(req.params.id)} } },
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Invoice Deleted"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing deleting the invoice:" +err};
                res.status(400).json(message);
            }
    });
});

//////////////////////////
//////edit invoice
router.put('/editInvoice', async (req, res) => {
//todo add error handling
    Project.findOneAndUpdate(
        {_id: req.body.projectId, 'invoice._id': req.body._id}, {
            $set: {
                'description': req.body.description,
                "seller": req.body.seller,
                'status': req.body.status,
                'totalCost': req.body.totalCost
            }
        },
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Invoice Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the invoice"};
                res.status(400).json(message);
            }
        })

});


////////////////////////////
// Add invoice
router.put('/addInvoice', async (req, res) => {

    const project = await Project.findByIdAndUpdate(req.body.projectId,
        {
            $push: {
                invoice: {
                    description: req.body.description,
                    invoiceDate: req.body.invoiceDate,
                    dateCreated: req.body.dateCreated,
                    status: req.body.status,
                    totalCost: req.body.totalCost,
                    seller: req.body.seller
                }
            }

        },
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Invoice Added"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue adding the Invoice"};
                res.status(400).json(message);
            }
        });

});

///////////////////////////
//add Purchase Order
router.put('/addPurchaseOrder',  async (req, res) => {

    const project = await Project.findByIdAndUpdate(req.body.projectId,
        {
            $push:{
                purchaseOrder:{
                    description: req.body.description,
                    invoiceDate: req.body.invoiceDate,
                    dateCreated: req.body.dateCreated,
                    status: req.body.status,
                    totalCost: req.body.totalCost,
                    buyer: req.body.buyer
                }
            }

        },
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "PO Added"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue adding the PO:"};
                res.status(400).json(message);
            }
        });

    //res.send(project);

});

//////////////////////////////////////////////////
//////edit purchaseOrder
router.put('/editPurchaseOrder', async (req, res) => {
//todo add error handling
    Project.findOneAndUpdate(
        { _id: req.body.projectId, 'purchaseOrder._id': req.body._id },{
            $set: { 'description': req.body.description,
                "seller":req.body.buyer,
                'status': req.body.status,
                'totalCost': req.body.totalCost
            }},
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "PO Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the PO:"};
                res.status(400).json(message);
            }
        })

});

////////////////////////////
//delete po
router.delete('/po/:id', async function (req, res) {

    filter = {"purchaseOrder._id": ObjectId(req.params.id)};

    Project.updateOne(filter,
        { $pull: {"purchaseOrder": {_id: ObjectId(req.params.id)} } },
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "PO Deleted"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue deleting the po:"};
                res.status(400).json(message);
            }
        });
});


///////////////////////////
//add task
router.put('/addTask',  async (req, res) => {

    await Project.findByIdAndUpdate(req.body.projectId,
        {
            $push:{
                task:{
                    description: req.body.description,
                    taskDate: req.body.invoiceDate,
                    dateCreated: req.body.dateCreated,
                    status: req.body.status,
                    time: req.body.time,
                    employee: req.body.employee
                }
            }
        },
        (err, response) => {

            console.log(response);
            if (!err) {
                let message = {status: 'Success', message: "Task Added"};
                res.json(message);

            } else {
                console.log(err);
                let message = {status: 'Error', message: "There was an issue adding the task:"};
                res.status(400).json(message);
            }
        });

    //res.send(task);

});

//////////////////////////////////////////////////
//////edit task
router.put('/editTask', async (req, res) => {
//todo add error handling
    Project.findOneAndUpdate(
        { _id: req.body.projectId, 'task._id': req.body._id },{
            $set: { 'description': req.body.description,
                'status': req.body.status,
                'time': req.body.time,
                'employee': req.body.employee
            }},
        (err, response) => {
            if (!err) {
                let message = {status: 'Success', message: "Task Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the task:"};
                res.status(400).json(message);
            }
        })

});

////////////////////////////
//delete po
router.delete('/task/:id', async function (req, res) {

    filter = {"task._id": ObjectId(req.params.id)};

    Project.updateOne(filter,
        { $pull: {"task": {_id: ObjectId(req.params.id)} } },
        (err, response) => {
            if (!err) {
                let message = {status: 'Success', message: "Task Deleted"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue deleting the task:"};
                res.status(400).json(message);
            }
        });
});


module.exports = router;
