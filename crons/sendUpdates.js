
var schedule = require('node-schedule');
let API_KEY = "83471As1KlQvfy5540eb14";
let FITZON_SENDER_ID = "FITZON";
let ROUTE_NO = "4";
var FITZON_msg91 = require("msg91")(API_KEY, FITZON_SENDER_ID, ROUTE_NO);

var sql = require('mssql');
const config = require('../config');

var localconfig = {
    server: config.sqlhostname,
    database: config.sqldatabase,
    user: config.sqlUsername,
    password: config.sqlPassword,
    port: config.sqlport,
    encrypt: config.encrypt
};

var j = schedule.scheduleJob('* * 23 * * *', function () {

    try {

        let messagetoSend = "Dear Admin, Todays Registration is $regcount$ and Todays Expense is $expamt$";
        let owners = "9538247169"

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("sendUpdates").then(function (results) {
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    console.log("No detail list exists");
                } else {

                    messagetoSend = messagetoSend.replace("$regcount$", results.recordset[0].todaysregisteration);
                    messagetoSend = messagetoSend.replace("$expamt$", results.recordset[0].todaysexpense);

                    FITZON_msg91.send(owners, messagetoSend, function (err, response) {
                        console.log(err);
                        console.log(response);
                    });
                }
                dbConn.close();
            }).catch(function (err) {
                console.log(err);
                dbConn.close();
            });
        }).catch(function (err) {
            console.log(err);
        });

    } catch (error) {
        console.log(error);
    }

});