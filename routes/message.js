let API_KEY = "83471As1KlQvfy5540eb14";
let FITZON_SENDER_ID = "FITZON";
let CRSFTN_SENDER_ID = "CRSFTN";
let AERBCS_SENDER_ID = "AERBCS";
let ROUTE_NO = "4";

// 1 - Promotional Route
// 4 - Transactional Route
// Mobile No can be a single number, list or csv string

// var mobileNo = "XXXXXXXXXX";

// var mobileNo = [ "XXXXXXXXXX", "XXXXXXXXXX", "XXXXXXXXXX" ];

// var mobileNo =  "XXXXXXXXXX,XXXXXXXXXX,XXXXXXXXXX";



// msg91.getBalance(function(err, msgCount){
//     console.log(err);
//     console.log(msgCount);
// });

// // Get Balance for given Route.
// msg91.getBalance("ROUTE_NO", function(err, msgCount){
//     console.log(err);
//     console.log(msgCount);
// });

var moment = require("moment");
const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
// var AuditLog = require("../routes/auditlog.js")
// var ErrorLog = require("../routes/errorlog.js")

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

//verify token
router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, "secret", function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Token Expired' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded; next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.post('/sendsms', function (req, res) {

    try {
        let selectedNumbers = req.body.contact;
        let messagetoSend = req.body.message;

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('selectedNumbers', sql.VarChar, selectedNumbers);
            request.execute("getmessagenumbers").then(function (results) {
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "No detail list exists"
                    });
                } else {

                    for (let index = 0; index < results.recordset.length; index++) {
                        const element = results.recordset[index];
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

                    res.send({
                        success: true,
                        message: "success"
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

router.get('/smsbalance', function (req, res) {

    try {
        let AERBCS_msg91 = require("msg91")(API_KEY, AERBCS_SENDER_ID, ROUTE_NO);
        AERBCS_msg91.getBalance(ROUTE_NO, function (err, msgCount) {
            //console.log(err);
            res.send({
                success: true,
                message: "success",
                data: msgCount
            });
        });


    } catch (error) {
        console.log(error);
    }
});

module.exports = router;