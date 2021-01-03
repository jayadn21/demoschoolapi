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

router.post('/getreports', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("AttendanceReportSetup_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Reports details not found"
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
router.post('/getreport', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("AttendanceReportSetup_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Report details not found"
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
    "Id":"2",
    "ClassSectionMediumId":"5",
    "ExecellentFrom":"80",
    "ExcellecntTo":"100",
    "GoodFrom":"60",
    "GoodTo":"79",
    "SatisfactoryFrom":"50",
    "SatisfactoryTo":"59",
    "PoorFrom":"35",
    "PoorTo":"49",
    "NotEligibleFrom":"0",
    "NotEligibleTo":"34"
}
*/
router.post('/setreport', function (req, res) {

    let reportSetupArr = req.body.reportSetupArr;


    try {
        if (reportSetupArr == "") throw "reportSetupArr is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            reportSetupArr.forEach(function (item) {
                var request = new sql.Request(dbConn);
                if (item.Selected) {
                    //request.input('Id', sql.Int, parseInt(item.Id, 10));
                    request.input('ClassSectionMediumId', sql.Int, parseInt(item.ClassSectionMediumId, 10));
                    request.input('ExecellentFrom', sql.Int, parseInt(item.ExecellentFrom));
                    request.input('ExcellecntTo', sql.Int, parseInt(item.ExcellecntTo));
                    request.input('GoodFrom', sql.Int, parseInt(item.GoodFrom));
                    request.input('GoodTo', sql.Int, parseInt(item.GoodTo));
                    request.input('SatisfactoryFrom', sql.Int, parseInt(item.SatisfactoryFrom));
                    request.input('SatisfactoryTo', sql.Int, parseInt(item.SatisfactoryTo));
                    request.input('PoorFrom', sql.Int, parseInt(item.PoorFrom));
                    request.input('PoorTo', sql.Int, parseInt(item.PoorTo));
                    request.input('NotEligibleFrom', sql.Int, parseInt(item.NotEligibleFrom));
                    request.input('NotEligibleTo', sql.Int, parseInt(item.NotEligibleTo));

                    request.execute("AttendanceReportSetup_CreateOrUpdate").then(function (results) {
                        console.log(results)
                        dbConn.close();
                    }).catch(function (err) {
                        dbConn.close();
                        console.log(err);
                        res.send({
                            success: false,
                            message: err.message
                        });
                    });
                }
            })
            //
            res.send({
                success: true,
                message: "success"
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
            message: error
        });
    }
});

router.post('/setsinglereport', function (req, res) {
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let ExecellentFrom = req.body.ExecellentFrom;
    let ExcellecntTo = req.body.ExcellecntTo;
    let GoodFrom = req.body.GoodFrom;
    let GoodTo = req.body.GoodTo;
    let SatisfactoryFrom = req.body.SatisfactoryFrom;
    let SatisfactoryTo = req.body.SatisfactoryTo;
    let PoorFrom = req.body.PoorFrom;
    let PoorTo = req.body.PoorTo;
    let NotEligibleFrom = req.body.NotEligibleFrom;
    let NotEligibleTo = req.body.NotEligibleTo;

    try {
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId   is empty";
        if (ExecellentFrom == "") throw "ExecellentFrom  is empty";
        if (ExcellecntTo == "") throw "ExcellecntTo  is empty";
        if (GoodFrom == "") throw "GoodFrom  is empty";
        if (GoodTo == "") throw "GoodTo  is empty";
        if (SatisfactoryFrom == "") throw "SatisfactoryFrom  is empty";
        if (SatisfactoryTo == "") throw "SatisfactoryTo  is empty";
        if (PoorFrom == "") throw "PoorFrom  is empty";
        if (PoorTo == "") throw "PoorTo  is empty";
        if (NotEligibleFrom == "") throw "NotEligibleFrom  is empty";
        if (NotEligibleTo == "") throw "NotEligibleTo  is empty";



        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('ExecellentFrom', sql.Int, parseInt(ExecellentFrom));
            request.input('ExcellecntTo', sql.Int, parseInt(ExcellecntTo));
            request.input('GoodFrom', sql.Int, parseInt(GoodFrom));
            request.input('GoodTo', sql.Int, parseInt(GoodTo));
            request.input('SatisfactoryFrom', sql.Int, parseInt(SatisfactoryFrom));
            request.input('SatisfactoryTo', sql.Int, parseInt(SatisfactoryTo));
            request.input('PoorFrom', sql.Int, parseInt(PoorFrom));
            request.input('PoorTo', sql.Int, parseInt(PoorTo));
            request.input('NotEligibleFrom', sql.Int, parseInt(NotEligibleFrom));
            request.input('NotEligibleTo', sql.Int, parseInt(NotEligibleTo));

            request.execute("AttendanceReportSetup_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Report.",
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

router.post('/delreport', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));

            request.execute("AttendanceReportSetup_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting Report.",
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
