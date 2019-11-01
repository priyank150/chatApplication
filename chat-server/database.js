'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createPool({
    host     : 't-database.cuiyfpy1ppxv.ap-south-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'tdatabase',
    port     : 3306,
    database : 'chatApp'
});


module.exports = connection;