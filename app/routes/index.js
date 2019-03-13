const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next){
    res.sendFile('login.html');
    next();
});

module.exports = router;