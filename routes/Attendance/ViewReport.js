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
    "AttendanceMonth" "10"
}
*/
router.post('/getAttendanceSelectByBatchClassMonthe', function (req, res) {
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let AttendanceMonth = req.body.AttendanceMonth;

    try {
        if (AcademicYearId == "") throw "AcademicYearId   is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId  is empty";
        if (AttendanceMonth == "") throw "AttendanceMonth  is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('AttendanceMonth', sql.Int, parseInt(AttendanceMonth, 10));

            request.execute("Attendance_SelectByBatchClassMonth").then(function (results) {
                console.log(results);
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student attendance details not found"
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
For new record, send Id as -1 else to update existing record, send Id with existing value.
{
    "AcademicYearId" "1",
    "ClassSectionMediumId" "3",
    "AttendanceMonth" "10"
    "Id" " "
    "StudentId" " "
    "IsPresent" " "   
    "IsHoliday" " "
    "AttendanceDate" " "
    "Name" " "
    AcademicYearId int,
    @ClassSectionMediumId int,
    @AttendanceMonth int
    ,@StudentId
    
}
*/
router.post('/getAttendanceSelectByBatchClassMonthStudent', function (req, res) {
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let AttendanceMonth = req.body.AttendanceMonth;
    let StudentId = req.body.StudentId;

    try {
        if (AcademicYearId == "") throw "AcademicYearId   is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId  is empty";
        if (AttendanceMonth == "") throw "AttendanceMonth  is empty";
        if (StudentId == "") throw "StudentId  is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('AttendanceMonth', sql.Int, parseInt(AttendanceMonth, 10));
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));

            request.execute("Attendance_SelectByBatchClassMonthStudent").then(function (results) {
                console.log(results);
                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student attendance details not found"
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

