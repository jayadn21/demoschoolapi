var md5 = require("md5");
var moment = require("moment");
const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");

// var AuditLog = require("../routes/auditlog.js")
// var ErrorLog = require("../routes/errorlog.js")

var sql = require('mssql');
const config = require('../../config');
var debug = require('debug')('http');

var localconfig = {
    server: config.sqlhostname,
    database: config.sqldatabase,
    user: config.sqlUsername,
    password: config.sqlPassword,
    port: config.sqlport,
    encrypt: config.encrypt
};

/* login */
router.post('/login', function (req, res) {
    let username = req.body.mobilenumber;
    let password = req.body.password;
    try {
        if (username == "") throw "Username is empty";
        if (password == "") throw "Password is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('phonenumber', sql.VarChar, username);
            request.input('password', sql.VarChar, password);
            request.execute("usp_validateLogin").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "phone-number not found or password mismatch"
                    });
                } else {
                    let uuserid = results.recordset[0].emailid;
                    var token = jwt.sign({ uuserid }, "secret", { expiresIn: '23h' });
                    res.send({
                        success: true,
                        token: token,
                        data: results.recordset
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

router.post('/createorupdateUser', function (req, res) {

    try {
        let fullname = req.body.fullname;
        let upassword = req.body.upassword;
        let phonenumber = req.body.phonenumber;
        let dateofbirth = req.body.dateofbirth;
        let createdby = req.body.createdby;
        let userid = req.body.phonenumber;
        let profilepic = req.body.profilepic;

        if (fullname == "") throw "fullname is empty";
        if (upassword == "") throw "password is empty";
        if (phonenumber == "") throw "phonenumber is empty";
        if (dateofbirth == "") throw "dateofbirth is empty";
        if (createdby == "") throw "createdby is empty";
        if (userid == "") throw "userid is empty";
        if (profilepic == "") throw "profile pic is not shared";

        profilepic = config.BaseUrl + profilepic;

        let dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            let request = new sql.Request(dbConn);
            request.input('fullname', sql.VarChar, fullname);
            request.input('upassword', sql.VarChar, upassword);
            request.input('phonenumber', sql.VarChar, phonenumber);
            request.input('dateofbirth', sql.DateTime, new Date(dateofbirth));
            request.input('who', sql.VarChar, createdby);
            request.input('userid', sql.VarChar, userid);
            request.input('profilepic', sql.VarChar, profilepic);
            request.execute("UserMaster").then(function (results) {
                if (results.recordset === [] || results.recordset === undefined || results.recordset.length === 0
                    || results.recordset === null) {

                    res.send({
                        success: true,
                        message: "success"
                    });
                }
                dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                console.log(err);
                res.send({
                    success: false,
                    message: err.message
                });

            });
        }).catch(function (err) {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/verifyotpmessage', function (req, res) {

    try {
        let phonenumber = req.body.phonenumber;
        let otpmessage = req.body.otpmessage;

        if (phonenumber == "") throw "emailid is empty";
        if (otpmessage == "") {
            throw "OTP Message is empty";
        }

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('phonenumber', sql.VarChar, phonenumber);
            request.input('otpmessage', sql.VarChar, otpmessage);
            request.output('userVerify', sql.Bit);
            request.execute("usp_verifyotpmessage").then(function (results) {
                if (results.output === [] || results.output === undefined || results.output.length === 0
                    || results.output === null) {
                    res.send({
                        success: false,
                        message: "some issue during the execution"
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        data: results.output
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

router.post('/CheckifuserExistsBynumber', function (req, res) {

    try {
        let phonenumber = req.body.phonenumber;

        if (phonenumber == "") throw "phonenumber is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('phonenumber', sql.VarChar, phonenumber);
            request.output('userExists', sql.Bit);
            request.execute("usp_validateusernumberexists").then(function (results) {
                if (results.output === [] || results.output === undefined || results.output.length === 0
                    || results.output === null) {
                    res.send({
                        success: false,
                        message: "some issue during the execution"
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        data: results.output
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


module.exports = router;
