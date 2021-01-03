var md5 = require("md5");
var moment = require("moment");
const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");

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
router.post('/loginUser', function (req, res) {
    let UserName = req.body.UserName;
    let Password = req.body.Password;
    try {
        if (UserName == "") throw "Username is empty";
        if (Password == "") throw "Password is empty";
        console.log(UserName);

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('UserName', sql.VarChar, UserName);
            request.input('Password', sql.VarChar, Password);
            request.execute("UserLoginSelectByUserNameAndPswd").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "UserName not found or Password mismatch"
                    });
                } else {
                    let iinstitutionid = results.recordset[0].emailid;
                    var token = jwt.sign({ iinstitutionid }, "secret", { expiresIn: '23h' });
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
                res.send({
                    success: false,
                    message: message
                });
            });
        }).catch(function (err) {
            console.log(err);
            res.send({
                success: false
            });
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false
        });
    }
});

module.exports = router;