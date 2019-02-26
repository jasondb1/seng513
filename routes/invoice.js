const express = require('express');
const router = express.Router();

const {Invoice} = require('../models/invoice');


///////////////////////////////////////////////////////////
//Invoices

///get/display all invoices
router.get('/', function(req, res, next) {
    //TODO: Implement this method
    res.send('Need to implement this');
});

//save project
router.post('/', function(req, res, next){
    //TODO: Implement this method
    res.send('Need to implement this');
});

//delete project
router.delete('/:id', function(req, res, next) {
    //TODO: Implement this method
    res.send('Need to implement this');
});

//update project
router.put('/:id', function(req, res, next) {
    //TODO: Implement this method
    res.send('Need to implement this');
});


module.exports = router;
