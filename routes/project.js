const express = require('express');
const router = express.Router();
let ObjectId = require('mongoose').Types.ObjectId;

const {Project} = require('../models/project');


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
    res.send('Need to fully implement this');

    //construct a new employee
    let newProject = new Project({
        description: req.body.description,
        id: req.body.id
    });

    //save into database
    newProject.save( (err, project) => {
       if(err){
           console.log ("Error saving project data:" + err);
       }
       else {
           res.send(project);
       }
    });
});

router.post('/:id', (req, res) => {
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
        if(err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

//update project
router.put('/:id', function(req, res, next) {
    //TODO: Implement this method
    res.send('Need to implement this');
});


module.exports = router;
