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

module.exports = router;

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

router.post('/getCastes', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("Caste_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Caste details not found"
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        data: results.recordsets
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
            res.send({
                success: false,
                message: err.message
            });
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error.message
        });
    }
});

// {
// 	"Id":"1"
// }
router.post('/getCaste', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("Caste_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Caste details not found"
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        data: results.recordsets
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
            res.send({
                success: false,
                message: err.message
            });
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error.message
        });
    }
});

/*
For new record, send Id as -1 else to update existing record, send Id with existing value.
{
    "Id":"-1",
    "CasteName":"OBC",
    "ReligionId":"2"
    }
*/
router.post('/setCaste', function (req, res) {
    let Id = req.body.Id;
    let CasteName = req.body.CasteName;
    let ReligionId = req.body.ReligionId;
    try {
        if (Id == "") throw "Id is empty";
        if (CasteName == "") throw "CasteName is empty";
        if (ReligionId == "") throw "ReligionId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('CasteName', sql.VarChar, CasteName);
            request.input('ReligionId', parseInt(ReligionId, 10));

            request.execute("Caste_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Caste.",
                        results: results
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        data: results.recordsets
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
            res.send({
                success: false,
                message: err.message
            });
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error
        });
    }
});