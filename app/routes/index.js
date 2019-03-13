const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next){
    res.sendFile('index.html');
    next();
});

module.exports = router;