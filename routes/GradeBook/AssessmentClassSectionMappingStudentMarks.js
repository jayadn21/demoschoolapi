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

router.post('/getAssessmentClassSectionMappingStudentMarks', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("AssessmentClassSectionMappingStudentMarks_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingStudentMarks details not found"
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
router.post('/getAssessmentClassSectionMappingStudentMark', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("AssessmentClassSectionMappingStudentMarks_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingStudentMarks details not found"
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
   "Id" : " ",
   "AssessmentClassSectionMappingId": " ",
   "StudentId": " ",
   "Marks": " ",
   "ClassSectionSubjectCombinationId: " ",
}
*/
// router.post('/setAssessmentClassSectionMappingStudentMarks', function (req, res) {
//     console.log(req.body);
//     let Id = req.body.Id;
//     let AssessmentClassSectionMappingId = req.body.AssessmentClassSectionMappingId;
//     let StudentId = req.body.StudentId;
//     let Marks = req.body.Marks;
//     let ClassSectionSubjectCombinationId = req.body.ClassSectionSubjectCombinationId;
//     console.log('Marks');
//     console.log('StudentId');
//     try {
//         if (Id == "") throw "Id is empty";
//         if (AssessmentClassSectionMappingId == "") throw "AssessmentClassSectionMappingId is empty";
//         if (StudentId == "") throw "StudentId is empty";
//         if (Marks == "") throw "Marks is empty";
//         if (ClassSectionSubjectCombinationId == "") throw "ClassSectionSubjectCombinationId is empty";
//         // console.log('Marks');
//         // console.log('StudentId');
//         var dbConn = new sql.ConnectionPool(localconfig);
//         dbConn.connect().then(function () {
//             var request = new sql.Request(dbConn);
//             request.input('Id', parseInt(Id, 10));
//             request.input('AssessmentClassSectionMappingId', parseInt(AssessmentClassSectionMappingId, 10));
//             request.input('StudentId', parseInt(StudentId, 10));
//             request.input('Marks', parseInt(Marks, 10));
//             request.input('ClassSectionSubjectCombinationId', parseInt(ClassSectionSubjectCombinationId, 10));

//             request.execute("AssessmentClassSectionMappingStudentMarks_CreateOrUpdate").then(function (results) {
//                 console.log(results);

//                 if (results.returnValue != 0) {
//                     res.send({
//                         success: false,
//                         message: "Error while updating Assessment ClassSectionMapping StudentMarks.",
//                         results: results
//                     });
//                 } else {
//                     res.send({
//                         success: true,
//                         message: "success",
//                         data: results.recordsets
//                     });
//                 }
//                 dbConn.close();
//             }).catch(function (err) {
//                 dbConn.close();
//                 console.log(err);
//                 res.send({
//                     success: false,
//                     message: err.message
//                 });
//             });
//         }).catch(function (err) {
//             res.send({
//                 success: false,
//                 message: err.message
//             });
//         });

//     } catch (error) {
//         console.log(error);
//         res.send({
//             success: false,
//             message: error
//         });
//     }
// });

router.post('/setAssessmentClassSectionMappingStudentMarks', function (req, res) {
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
    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        //call AssessmentClassSectionMapping_CreateOrUpdate sp
        request.output('AssessmentClassSectionMappingId', sql.Int);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('AssessmentId', sql.Int, parseInt(AssessmentId, 10));
            request.input('AssessmentDate', sql.VarChar, AssessmentDate);
            request.input('MarksReductionPercentage', sql.Int, parseInt(MarksReductionPercentage, 10));
            request.input('CalculateSecSubjMarksAs', sql.VarChar, CalculateSecSubjMarksAs);
            request.input('AssessmentHeadId', sql.Int, parseInt(AssessmentHeadId, 10));
            request.execute("AssessmentClassSectionMapping_CreateOrUpdate").then(function (recordsets) {
                console.log(recordsets.output.AssessmentClassSectionMappingId);
                if (recordsets.output.AssessmentClassSectionMappingId == 0) {
                    //result false
                    dbConn.close();
                    console.log(err);
                    res.send({
                        success: false,
                        message: err.message
                    });
                } else {
                    Id = recordsets.output.AssessmentClassSectionMappingId;
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
        });
        if (fieldArray == "") throw "fieldArray is empty";
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(Id, 10));
                request.input('AssessmentClassSectionMappingId', sql.Int, parseInt(field.AssessmentClassSectionMappingId, 10));
                request.input('MinMarks', sql.Int, parseInt(field.MinMarks, 10));
                request.input('MaxMarks', sql.Int, parseInt(field.MaxMarks, 10));
                request.execute("AssessmentClassSectionMappingMarks_CreateOrUpdate").then(function (results) {
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
                    message: "Error while updating AssessmentClassSectionMappingMarks."
                });
            } else {
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
/*
For delete, send Id.
{
    "Id":"1",
    }
*/

router.post('/delAssessmentClassSectionMappingStudentMarks', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));

            request.execute("AssessmentClassSectionMappingStudentMarks_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting AssessmentClassSectionMappingStudentMarks.",
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
/* For new record, send Id as -1 else to update existing record, send Id with existing value.
{
    "ClassSectionMediumId": "",
    "AcademicYearId": ""
}
*/
router.post('/getClassSectionSubjectCombination', function (req, res) {
    // let SubjectSubjectCombinationMappingId = req.body.SubjectSubjectCombinationMappingId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let AcademicYearId = req.body.AcademicYearId;

    try {
        // if (SubjectSubjectCombinationMappingId == "") throw "SubjectSubjectCombinationMappingId is empty"; 
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            // request.input('SubjectSubjectCombinationMappingId', parseInt(SubjectSubjectCombinationMappingId, 10));
            request.input('ClassSectionMediumId', parseInt(ClassSectionMediumId, 10));
            request.input('AcademicYearId', parseInt(AcademicYearId, 10));

            request.execute("ClassSectionSubjectCombination_SelectByParams").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Class Section Subject Mapping details not found!!!"
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


router.post('/getAssessmentClassSectionMappingStudentMarks', function (req, res) {
    let StudentId = req.body.StudentId;
    try {
        if (StudentId == "") throw "StudentId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));
            request.execute("AssessmentClassSectionMappingStudentMarks_selectByStudentId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingStudentMarks details not found"
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


router.post('/getassessmentClassSectionMappingStudentMarksAssessmentId', function (req, res) {
    let StudentId = req.body.StudentId;
    let AssessmentId = req.body.AssessmentId;
    try {
        if (StudentId == "") throw "StudentId is empty";
        if (AssessmentId == "") throw "AssessmentId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));
            request.input('AssessmentId', sql.Int, parseInt(AssessmentId, 10));

            request.execute("AssessmentClassSectionMappingStudentMarks_AssessmentId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "AssessmentClassSectionMappingStudentMarksAssessmentId details not found"
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

router.post('/getAssessmentClassSectionMappingStudentMarksACSMIdCSSCId', function (req, res) {
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
            request.execute("AssessmentClassSectionMappingStudentMarks_selectBy_ACSMId_CSSCId").then(function (results) {
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