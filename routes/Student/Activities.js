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

router.post('/getActivities', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("Activities_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Activities details not found"
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
router.post('/getActivity', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("Activities_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Activities details not found"
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
    "Id":"1",
    "EmployeeId": "int"
    "StudentId": "int"
    "Description": "varchar(254)"
    "Employeename": "varchar(254)"
    "Date": "varchar(254)"
}
*/
router.post('/setActivity', function (req, res) {
    let Id = req.body.Id;
    let EmployeeId = req.body.EmployeeId;
    let StudentId = req.body.StudentId;
    let Description = req.body.Description;
    let Employeename = req.body.Employeename;
    let Date = req.body.Date;


    try {
        if (Id == "") throw "Id is empty";
        if (EmployeeId == "") throw "EmployeeId is empty";
        if (StudentId == "") throw "StudentId is empty";
        if (Description == "") throw "Description is empty";
        if (Employeename == "") throw "Employeename is empty";
        if (Date == "") throw "Date is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('EmployeeId', parseInt(EmployeeId, 10));
            request.input('StudentId', parseInt(StudentId, 10));
            request.input('Description', sql.VarChar, Description);
            request.input('Employeename', sql.VarChar, Employeename);
            request.input('Date', sql.VarChar, Date);

            request.execute("Activities_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Activities",
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

router.post('/getActivitySelect', function (req, res) {
    let StudentId = req.body.StudentId;
    try {
        if (StudentId == "") throw "StudentId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));
            request.execute("Activities_selectByStudentId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Activities details not found"
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
