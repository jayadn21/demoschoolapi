
var schedule = require('node-schedule');
let API_KEY = "83471As1KlQvfy5540eb14";
let FITZON_SENDER_ID = "FITZON";
let CRSFTN_SENDER_ID = "CRSFTN";
let AERBCS_SENDER_ID = "AERBCS";
let ROUTE_NO = "4";

var sql = require('mssql');
const config = require('../config');
var debug = require('debug')('http');

var localconfig = {
    server: config.sqlhostname,
    database: config.sqldatabase,
    user: config.sqlUsername,
    password: config.sqlPassword,
    port: config.sqlport,
    encrypt: config.encrypt
};



var j = schedule.scheduleJob('* * 5 * * *', function () {

    try {

        let messagetoSend = "Hi $name$, Fitness Zone wishes you a very happy birthday !! Stay fit and healthy !!!";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("sendsmswishes").then(function (results) {
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    console.log("No detail list exists");
                } else {

                    for (let index = 0; index < results.recordset.length; index++) {
                        const element = results.recordset[index];
                        messagetoSend = messagetoSend.replace("$name$", element.firstname);
                        if (element.Branch_name === 'Gym') {
                            let FITZON_msg91 = require("msg91")(API_KEY, FITZON_SENDER_ID, ROUTE_NO);
                            FITZON_msg91.send(element.phonenumber, messagetoSend, function (err, response) {
                                console.log(err);
                                console.log(response);
                            });
                        } else if (element.Branch_name === 'Aerobics') {
                            let AERBCS_msg91 = require("msg91")(API_KEY, AERBCS_SENDER_ID, ROUTE_NO);
                            AERBCS_msg91.send(element.phonenumber, messagetoSend, function (err, response) {
                                console.log(err);
                                console.log(response);
                            });
                        } else {
                            let CRSFTN_msg91 = require("msg91")(API_KEY, CRSFTN_SENDER_ID, ROUTE_NO);
                            CRSFTN_msg91.send(element.phonenumber, messagetoSend, function (err, response) {
                                console.log(err);
                                console.log(response);
                            });
                        }

                    }
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