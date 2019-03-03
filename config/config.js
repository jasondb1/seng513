//this manages the configuration files LOADING 

module.exports = require('./env/'
    + process.env.NODE_ENV
    + '.js');

