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

router.post('/getAssessmentClassSectionMappingMarks', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("AssessmentClassSectionMappingMarks_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingMarks details not found"
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
router.post('/getAssessmentClassSectionMappingMark', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("AssessmentClassSectionMappingMarks_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingMarks details not found"
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
    "AcademicYearId":"",
    "ClassSectionMediumId":"",
    "AssessmentId":"",
    "AssessmentDate":"",
    "MarksReductionPercentage":"",
    "CalculateSecSubjMarksAs":"",
    "AssessmentHeadId":"",
    "fieldArray": ""
}
*/
router.post('/setAssessmentClassSectionMappingMarks', function (req, res) {
    console.log('setAssessmentClassSectionMappingMarks===>');
    //console.log(req.body);
    let Id = req.body.Id;
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let AssessmentId = req.body.AssessmentId;
    let AssessmentDate = req.body.AssessmentDate;
    let MarksReductionPercentage = req.body.MarksReductionPercentage;
    let CalculateSecSubjMarksAs = req.body.CalculateSecSubjMarksAs;
    let AssessmentHeadId = req.body.AssessmentHeadId;
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    let studentMarksArray = req.body.studentMarksArray;
    let AssessmentClassSectionMappingId_out = -1;
    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        //call AssessmentClassSectionMapping_CreateOrUpdate sp
        dbConn.connect().then(function () {
            console.log('Step1: ===>');
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('AssessmentId', sql.Int, parseInt(AssessmentId, 10));
            request.input('AssessmentDate', sql.VarChar, AssessmentDate);
            request.input('MarksReductionPercentage', sql.Int, parseInt(MarksReductionPercentage, 10));
            request.input('CalculateSecSubjMarksAs', sql.VarChar, CalculateSecSubjMarksAs);
            request.input('AssessmentHeadId', sql.Int, parseInt(AssessmentHeadId, 10));
            request.output('AssessmentClassSectionMappingId', sql.Int);
            console.log('Step2: ===>');
            request.execute("AssessmentClassSectionMapping_CreateOrUpdate").then(function (recordsets) {
                console.log('Step3: ===>');
                console.log(recordsets.output.AssessmentClassSectionMappingId);
                if (recordsets.output.AssessmentClassSectionMappingId == 0) {
                    //result false
                    console.log(err);
                    res.send({
                        success: false,
                        message: err.message
                    });
                } else {
                    console.log('Step4: ===>');
                    AssessmentClassSectionMappingId_out = recordsets.output.AssessmentClassSectionMappingId;
                    console.log(AssessmentClassSectionMappingId_out);
                    //dbConn.close();
                    ////
                    if (fieldArray == "") throw "fieldArray is empty";
                    var dbConn2 = new sql.ConnectionPool(localconfig);
                    dbConn2.connect().then(function () {
                        fieldArray.forEach(function (field) {
                            console.log('field ===>');
                            console.log(field);
                            var request2 = new sql.Request(dbConn2);
                            request2.input('Id', sql.Int, parseInt(field.Id, 10));
                            request2.input('AssessmentClassSectionMappingId', sql.Int, parseInt(AssessmentClassSectionMappingId_out, 10));
                            request2.input('MinMarks', sql.Int, parseInt(field.MinMarks, 10));
                            request2.input('MaxMarks', sql.Int, parseInt(field.MaxMarks, 10));
                            request2.input('ClassSectionSubjectCombinationId', sql.Int, parseInt(field.ClassSectionSubjectCombinationId, 10));
                            request2.execute("AssessmentClassSectionMappingMarks_CreateOrUpdate").then(function (results) {
                                console.log(results);

                                if (results.returnValue != 0) {
                                    errorInForLop = true;
                                }
                                dbConn2.close();
                            }).catch(function (err) {
                                dbConn2.close();
                                console.log(err);
                                errorInForLop = true;
                            });
                        })
                    });
                    //\\
                    ////
                    if (studentMarksArray == "") throw "studentMarksArray is empty";
                    studentMarksArray.forEach(function (student) {

                        var dbConn2 = new sql.ConnectionPool(localconfig);
                        dbConn2.connect().then(function () {
                            student.StudentAssessmentMarksArr.forEach(function (field) {
                                console.log('field ===>');
                                console.log(field);
                                var request2 = new sql.Request(dbConn2);
                                request2.input('Id', sql.Int, parseInt(field.Id, 10));
                                request2.input('AssessmentClassSectionMappingId', sql.Int, parseInt(AssessmentClassSectionMappingId_out, 10));
                                request2.input('StudentId', sql.Int, parseInt(student.StudentId, 10));
                                request2.input('Marks', sql.Int, parseInt(field.Marks, 10));
                                request2.input('ClassSectionSubjectCombinationId', sql.Int, parseInt(field.ClassSectionSubjectCombinationId, 10));
                                request2.execute("AssessmentClassSectionMappingStudentMarks_CreateOrUpdate").then(function (results) {
                                    console.log(results);

                                    if (results.returnValue != 0) {
                                        errorInForLop = true;
                                    }
                                    dbConn2.close();
                                }).catch(function (err) {
                                    dbConn2.close();
                                    console.log(err);
                                    errorInForLop = true;
                                });
                            })

                        });
                    });
                    //\\
                }
                if (errorInForLop === true) {
                    res.send({
                        success: false,
                        message: "Error while updating Assessment Marks details."
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success"
                    });
                }
                dbConn.close();
            }).catch(function (err) {
                console.log('Step7: ===>');
                dbConn.close();
                console.log(err);
                res.send({
                    success: false,
                    message: err.message
                });
            });
        }).catch(function (err) {
            console.log('Step8: ===>');
            console.log(err);
            dbConn.close();
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error
        });
    }

});


router.post('/setAssessmentClassSectionMappingStudentMarks', function (req, res) {
    console.log('setAssessmentClassSectionMappingStudentMarks===>');
    //console.log(req.body);
    let Id = req.body.Id;
    let AssessmentClassSectionMappingId = req.body.AssessmentClassSectionMappingId;
    let StudentId = req.body.StudentId;
    let Marks = req.body.Marks;
    let ClassSectionSubjectCombinationId = req.body.ClassSectionSubjectCombinationId;
    let studentMarksArray = req.body.studentMarksArray;
    let errorInForLop = false;
    let AssessmentClassSectionMappingId_out = -1;
    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        //call AssessmentClassSectionMapping_CreateOrUpdate sp
        dbConn.connect().then(function () {
            console.log('Step1: ===>');
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('AssessmentClassSectionMappingId', sql.Int, parseInt(AssessmentClassSectionMappingId, 10));
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));
            request.input('Marks', sql.Int, parseInt(Marks, 10));
            request.input('ClassSectionSubjectCombinationId', sql.Int, parseInt(ClassSectionSubjectCombinationId, 10));
            console.log('Step2: ===>');
            request.execute("AssessmentClassSectionMapping_CreateOrUpdate").then(function (recordsets) {
                console.log('Step3: ===>');
                console.log(recordsets.output.AssessmentClassSectionMappingId);
                if (recordsets.output.AssessmentClassSectionMappingId == 0) {
                    //result false
                    console.log(err);
                    res.send({
                        success: false,
                        message: err.message
                    });
                } else {
                    console.log('Step4: ===>');
                    AssessmentClassSectionMappingId_out = recordsets.output.AssessmentClassSectionMappingId;
                    console.log(AssessmentClassSectionMappingId_out);
                    //dbConn.close();
                    ////
                    if (studentMarksArray == "") throw "studentMarksArray is empty";
                    var dbConn2 = new sql.ConnectionPool(localconfig);
                    dbConn2.connect().then(function () {
                        studentMarksArray.forEach(function (field) {
                            console.log('field ===>');
                            console.log(field);
                            var request2 = new sql.Request(dbConn2);
                            request2.input('Id', sql.Int, parseInt(field.Id, 10));
                            request2.input('AssessmentClassSectionMappingId', sql.Int, parseInt(AssessmentClassSectionMappingId_out, 10));
                            request2.input('MinMarks', sql.Int, parseInt(field.MinMarks, 10));
                            request2.input('MaxMarks', sql.Int, parseInt(field.MaxMarks, 10));
                            request2.execute("AssessmentClassSectionMappingStudentMarks_CreateOrUpdate").then(function (results) {
                                console.log(results);

                                if (results.returnValue != 0) {
                                    errorInForLop = true;
                                }
                                dbConn2.close();
                            }).catch(function (err) {
                                dbConn2.close();
                                console.log(err);
                                errorInForLop = true;
                            });
                        })

                        if (errorInForLop === true) {
                            res.send({
                                success: false,
                                message: "Error while updating AssessmentClassSectionMappingStudentMarks."
                            });
                        } else {
                            res.send({
                                success: true,
                                message: "success"
                            });
                        }

                    });
                    //\\
                }
                dbConn.close();
            }).catch(function (err) {
                console.log('Step7: ===>');
                dbConn.close();
                console.log(err);
                res.send({
                    success: false,
                    message: err.message
                });
            });
        }).catch(function (err) {
            console.log('Step8: ===>');
            console.log(err);
            dbConn.close();
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

router.post('/delAssessmentClassSectionMappingMarks', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));

            request.execute("AssessmentClassSectionMappingMarks_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting AssessmentClassSectionMappingMarks.",
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

router.post('/getAssessmentClassSectionMappingselectByAcademicYearAndClass', function (req, res) {
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    try {
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AcademicYearId', parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', parseInt(ClassSectionMediumId, 10));

            request.execute("AssessmentClassSectionMapping_selectByAcademicYearAndClass").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting AssessmentClassSectionMappingselectByAcademicYearAndClass.",
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
router.post('/getAssessmentClassSectionMappingMarksACSMIdCSSCId', function (req, res) {
    let AssessmentClassSectionMappingId = req.body.AssessmentClassSectionMappingId;
    let ClassSectionSubjectCombinationId = req.body.ClassSectionSubjectCombinationId;
    try {
        if (AssessmentClassSectionMappingId == "") throw "AssessmentClassSectionMappingId is empty";
        if (ClassSectionSubjectCombinationId == "") throw "ClassSectionSubjectCombinationId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AssessmentClassSectionMappingId', sql.Int, parseInt(AssessmentClassSectionMappingId, 10));
            request.input('ClassSectionSubjectCombinationId', sql.Int, parseInt(ClassSectionSubjectCombinationId, 10));
            request.execute("AssessmentClassSectionMappingMarks_selectBy_ACSMId_CSSCId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingMarks details not found"
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