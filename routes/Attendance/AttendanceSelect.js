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
/*
For new record, send Id as -1 else to update existing record, send Id with existing value.
{
    "AcademicYearId" "1",
    "ClassSectionMediumId" "3",
}
*/
router.post('/getStudentSelectForAttendance', function (req, res) {
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    try {
        if (AcademicYearId == "") throw "AcademicYearId   is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId  is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));

            request.execute("StudentSelectForAttendance").then(function (results) {
                console.log(results);
                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating SelectAttendance.",
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

