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
                return res.json({
                    success: false,
                    message: 'Token Expired'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
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

router.post('/getClassSectionSubjectCombinations', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("ClassSectionSubjectCombination_SelectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "ClassSectionSubjectCombination details not found"
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
router.post('/getClassSectionSubjectCombination', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("ClassSectionSubjectCombination_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "ClassSectionSubjectCombination details not found"
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
    "SubjectId": "",
    "SubjectCombinationId": "",
    "ClassSectionMediumId": "",
    "AcademicYearId": ""
}
*/
router.post('/setClassSectionSubjectCombination', function (req, res) {
    let Id = req.body.Id;
    let SubjectId = req.body.SubjectId;
    let SubjectCombinationId = req.body.SubjectCombinationId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let AcademicYearId = req.body.AcademicYearId;

    try {
        if (Id == "") throw "Id is empty";
        if (SubjectId == "") throw "SubjectId is empty";
        if (SubjectCombinationId == "") throw "SubjectCombinationId is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('SubjectId', parseInt(SubjectId, 10));
            request.input('SubjectCombinationId', parseInt(SubjectCombinationId, 10));
            request.input('ClassSectionMediumId', parseInt(ClassSectionMediumId, 10));
            request.input('AcademicYearId', parseInt(AcademicYearId, 10));

            request.execute("ClassSectionSubjectCombination_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating ClassSectionSubjectCombination.",
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

/*
For delete, send Id.
{
    "Id":"1",
    }
*/

router.post('/delClassSectionSubjectCombination', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));

            request.execute("ClassSectionSubjectCombination_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting ClassSectionSubjectCombination.",
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