const express = require('express');
const router = express.Router();
let ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const Project = require('../models/project');


///////////////////////////////////////////////////////////
//Projects

///get/display all projects
router.get('/', function(req, res) {

    Project.find( (err, projects) => {
        if (!err) {
            res.json(projects);
        }
        else {
            console.log("Error retrieving project:" + err);
        }

    });
});

//save project
router.post('/', function(req, res){
    //TODO: Implement this method
    //TODO: if id is -1 assign a number

    //THis comment
   // res.send('Need to fully implement this');

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
    newProject.save( (err, project) => {
       if(err){
           let message = {status: 'Error', message: 'Project Could Not Be Added:' + err};
           console.log ("Error saving project data:" + err);
           res.json(message);
       }
       else {
           let message = {status: 'Success', message: "New Project Added"};
           res.json(message);
       }

    });
});

router.get('/:id/', (req, res) => {
   //check if id exists in db
    if (!ObjectId.isValid(req.params.id))
       return res.status(400).send('No record matches id: ' + req.params.id);

        Project.findById(req.params.id, (err, project) => {
            if(err){
                console.log ("Error saving project data:" + err);
            }
            else {
                res.send(project);
            }
        });

});

//delete project
router.delete('/:id', function(req, res) {
    //TODO: Implement this method
    res.send('Need to fully implement this');
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


//////edit Project
router.put('/editProject', async (req, res) => {

    //update the project
    Project.findOneAndUpdate({_id: req.body._id}, {$set: req.body}, {new: true, runValidators: true},
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Project Edited"};
               res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the Project"};
                res.status(400).json(message);
            }
        });
});



//////edit invoice
router.put('/editInvoice', async (req, res) => {

    //update the project
    Project.findOneAndUpdate({_id: req.body._id}, {$set: req.body}, {new: true, runValidators: true},
        (err, response) => {

            if (!err) {
                let message = {status: 'Success', message: "Project Edited"};
                res.json(message);

            } else {
                let message = {status: 'Error', message: "There was an issue editing the Project"};
                res.status(400).json(message);
            }
        });
});




/*//update project description/status
router.put('/:id/', function(req, res) {
    //TODO: Implement this method
    res.send('Need to implement this');
});

router.put('addEmployees/:id/', function(req, res) {

    console.log(req);
    //
    // async function addEmployee(projectId, employeeID){
    //     const project= await Project.findById(projectId);
    //     project.employees.push(employeeID);
    //     project.save();
    // }


    res.send('Need to implement this');
});*/

/*
router.put('removeEmployees/:id/', function(req, res) {
    //TODO: Implement this method
    res.send('Need to implement this');
});
*/


router.put('/addInvoice',  async (req, res) => {

    console.log(req.body);

    const project = await Project.findByIdAndUpdate(req.body.projectId,
        {
           $push:{
               invoice:{
                   description: req.body.description,
                   invoiceDate: req.body.invoiceDate,
                   dateCreated: req.body.dateCreated,
                   status: req.body.status,
                   totalCost: req.body.totalCost,
                   seller: req.body.seller
               }
           }

        });

    console.log(project);
    res.send(project);

});

/*
db.posts.update({_id: ObjectId("5121908755734d2f29000123")}, {
    $push: {
        comments: {
            "authorId": ObjectId("50d013076a2208d3060000a7"),
            "content": "Some content again"
        }
    }
})
*/

module.exports = router;
