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

/* get systemsetup */
/*
{
    "InstitutionId":"1"
}
*/
router.post('/getsystemsetup', function (req, res) {
    let InstitutionId = req.body.InstitutionId;
    console.log('InstitutionId ===>: ' + InstitutionId);
    try {
        if (InstitutionId == "") throw "InstitutionId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.execute("SystemSetupByInstitutionId").then(function (results) {
                //console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "InstitutionId: " + InstitutionId + ", Institution group SystemSetup details not found."
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
                    message: err.message + "institution group id: " + req.body.Id
                });
            });
        }).catch(function (err) {
            console.log(err);
        });

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

// [InstitutionId]
// 	,[DefaultDateTimeZoneId]
// 	,[PaginationPerPage]
// 	,[PaginationNumberOfLinksToShow]
// 	,[DefaultApplicationFeesId]
// 	,[SignatureOfDdpi]
// 	,[SmsEnabled]
// 	,[ParentsLoginEnabled]
// 	,[MergePaymentReport]
// 	,[MannualAttandanceRollNumber]

router.post('/setSystemSetup', function (req, res) {
    let Id = req.body.Id;
    let InstitutionId = req.body.InstitutionId;
    let DefaultDateTimeZoneId = req.body.DefaultDateTimeZoneId;
    let PaginationPerPage = req.body.PaginationPerPage;
    let PaginationNumberOfLinksToShow = req.body.PaginationNumberOfLinksToShow;
    let DefaultApplicationFeesId = req.body.DefaultApplicationFeesId;
    let SignatureOfDdpi = req.body.SignatureOfDdpi;
    let SmsEnabled = req.body.SmsEnabled;
    let ParentsLoginEnabled = req.body.ParentsLoginEnabled;
    let MergePaymentReport = req.body.MergePaymentReport;
    let MannualAttandanceRollNumber = req.body.MannualAttandanceRollNumber;


    try {
        if (Id == "") throw "Id is empty";
        if (InstitutionId == "") throw "InstitutionId   is empty";
        if (DefaultDateTimeZoneId == "") throw "DefaultDateTimeZoneId  is empty";
        if (PaginationPerPage == "") throw "PaginationPerPage is empty";
        if (PaginationNumberOfLinksToShow == "") throw "PaginationNumberOfLinksToShow   is empty";
        if (DefaultApplicationFeesId == "") throw "DefaultApplicationFeesId  is empty";
        // if (SignatureOfDdpi == "") throw "SignatureOfDdpi is empty";
        // if (SmsEnabled == "") throw "SmsEnabled   is empty";
        // if (ParentsLoginEnabled == "") throw "ParentsLoginEnabled  is empty";
        // if (MergePaymentReport == "") throw "MergePaymentReport is empty";
        // if (MannualAttandanceRollNumber == "") throw "MannualAttandanceRollNumber   is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.input('DefaultDateTimeZoneId', sql.Int, parseInt(DefaultDateTimeZoneId, 10));
            request.input('PaginationPerPage', sql.Int, parseInt(PaginationPerPage, 10));
            request.input('PaginationNumberOfLinksToShow', sql.Int, parseInt(PaginationNumberOfLinksToShow, 10));
            request.input('DefaultApplicationFeesId', sql.Int, parseInt(DefaultApplicationFeesId, 10));
            request.input('SignatureOfDdpi', sql.VarChar, SignatureOfDdpi);
            request.input('SmsEnabled', sql.VarChar, SmsEnabled);
            request.input('ParentsLoginEnabled', sql.VarChar, ParentsLoginEnabled);
            request.input('MergePaymentReport', sql.VarChar, MergePaymentReport);
            request.input('MannualAttandanceRollNumber', sql.VarChar, MannualAttandanceRollNumber);


            request.execute("SystemSetup_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating SystemSetup.",
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


router.post('/getSystemSetups', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("SystemSetup_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "SystemSetup details not found"
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

router.post('/getTimeZones', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("TimeZones_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "TimeZones details not found"
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