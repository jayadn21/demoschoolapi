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
    "StudentId" "1",
    "AcademicYearId" "2",
    "ClassSectionMediumId" "3",
    "IsPresent" "True"
}
*/
router.post('/setattendanceInsert', function (req, res) {
    // console.log('---------------------------');
    // console.log(req.body.studentArray);
    // console.log('---------------------------');
    let AttendanceDate = req.body.AttendanceDate;
    let IsHoliday = req.body.IsHoliday;
    let studentArray = req.body.studentArray;
    // let StudentId = req.body.StudentId;
    // let AcademicYearId = req.body.AcademicYearId;
    // let ClassSectionMediumId = req.body.ClassSectionMediumId;
    // let IsPresent = req.body.IsPresent;
    // let IsHoliday = req.body.IsHoliday;
    try {
        if (studentArray == "") throw "studentArray is empty";

        // if (AcademicYearId == "") throw "AcademicYearId   is empty";
        // if (ClassSectionMediumId == "") throw "ClassSectionMediumId  is empty";
        // if (IsPresent == "") throw "IsPresent  is empty";
        // if (IsHoliday == "") throw "IsHoliday  is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            studentArray.forEach(function (student) {
                var request = new sql.Request(dbConn);
                student.IsHoliday = IsHoliday;
                student.AttendanceDate = AttendanceDate;

                console.log("----------student");
                console.log(student);
                console.log("//////////student");

                request.input('StudentId', sql.Int, parseInt(student.Id, 10));
                request.input('AcademicYearId', sql.Int, parseInt(student.AcademicYearId, 10));
                request.input('ClassSectionMediumId', sql.Int, parseInt(student.CurrentClassSectionMediumId, 10));
                request.input('IsPresent', sql.VarChar, student.IsPresent);
                request.input('IsHoliday', sql.VarChar, student.IsHoliday); //AttendanceDate
                request.input('AttendanceDate', sql.VarChar, student.AttendanceDate); //AttendanceDate

                request.execute("Attendance_insert").then(function (results) {
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

