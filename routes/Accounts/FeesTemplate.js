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

router.post('/getFeesTemplates', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("FeesTemplate_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "FeesTemplate details not found"
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
router.post('/getFeesTemplate', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("FeesTemplate_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "FeesTemplate details not found"
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
    "Id":"",
    "Name":""
}
*/
router.post('/setFeesTemplate', function (req, res) {
    let Id = req.body.Id;
    let Name = req.body.Name;
    let DueDate = req.body.DueDate;
    let FeesHeaderId = req.body.FeesHeaderId;
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let Instructions = req.body.Instructions;
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (Id == "") throw "Id is empty";
        if (Name == "") throw "Name is empty";
        if (DueDate == "") throw "DueDate is empty";
        if (FeesHeaderId == "") throw "FeesHeaderId is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId is empty";
        if (fieldArray == "") throw "fieldArray is empty";
        if (Instructions == "") throw "Instructions is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('Name', sql.VarChar, Name);
            request.input('DueDate', sql.VarChar, DueDate);
            request.input('FeesHeaderId', sql.Int, FeesHeaderId);
            request.input('AcademicYearId', sql.Int, AcademicYearId);
            request.input('ClassSectionMediumId', sql.Int, ClassSectionMediumId);
            request.input('Instructions', sql.VarChar, Instructions);
            request.execute("FeesTemplate_CreateOrUpdate").then(function (results) {
                console.log(results);
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "FeesTemplate update failed."
                    });
                } else {
                    console.log("results.recordsets.data[0][FeesTemplateId] =>");
                    console.log(results.recordset[0]['FeesTemplateId']);
                    FeesTemplateId = results.recordset[0]['FeesTemplateId'];
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
            fieldArray.forEach(function (field) {
                var request = new sql.Request(dbConn);
                field.FeesTemplateId = FeesTemplateId;
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('FeesTemplateId', sql.Int, field.FeesTemplateId);
                request.input('FeesAccountId', sql.Int, field.FeesAccountId);
                request.input('Description', sql.VarChar, field.Description);
                request.input('Fees', sql.Int, field.Fees);
                request.execute("FeesTemplateFeesAccountMapping_CreateByFeesTemplateId").then(function (results) {
                    console.log(results);

                    if (results.returnValue != 0) {
                        errorInForLop = true;
                    }
                    dbConn.close();
                }).catch(function (err) {
                    dbConn.close();
                    console.log(err);
                    errorInForLop = true;
                });
            })

            if (errorInForLop === true) {
                res.send({
                    success: false,
                    message: "Error while creating Fees Template Account Mapping."
                });
            }
            else {
                res.send({
                    success: true,
                    message: "success"
                });
            }

        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error
        });
    }
});

router.post('/delFeesTemplate', function (req, res) {
    let Id = req.body.Id;

    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));

            request.execute("FeesTemplate_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while Deleting.",
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