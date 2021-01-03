//// @ts-check
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

router.post('/getstudents', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("StudentSelectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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

router.post('/getStudentsCountOnCsm', function (req, res) {
    let InstitutionId = req.body.InstitutionId;
    try {
        if (InstitutionId == "") throw "InstitutionId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.execute("StudentCountOnClassSectionMedium").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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

router.post('/getstudentcount', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("Student_totalCount").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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

router.post('/getParentAppInstalledCount', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("Parent_ParentAppInstalledCount").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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
router.post('/getstudent', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("StudentSelectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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
// 	"ApplicationNumber":"1"
// }
router.post('/getstudentByApplicationNumber', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    console.log('Application Number ->>>>>>');
    console.log(ApplicationNumber);
    try {
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.execute("StudentSelectByApplicationNumber").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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
// 	"ApplicationNumber":"1"
// }
router.post('/getstudentAndPaymentByApplicationNumber', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    //console.log('Application Number ->>>>>>');
    //console.log(ApplicationNumber);
    try {
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.execute("StudentDetailsAndPaymentDetails_Select").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student details not found"
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
// 	"AcademicYearId":"1",
// 	"ClassSectionMediumId":"1",
// 	"StudentId":"9"
// }
router.post('/getStudentPaymentDetails', function (req, res) {
    let AcademicYearId = req.body.AcademicYearId;
    let ClassSectionMediumId = req.body.ClassSectionMediumId;
    let StudentId = req.body.StudentId;
    try {
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (ClassSectionMediumId == "") throw "ClassSectionMediumId is empty";
        if (StudentId == "") throw "StudentId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassSectionMediumId', sql.Int, parseInt(ClassSectionMediumId, 10));
            request.input('StudentId', sql.Int, parseInt(StudentId, 10));
            request.execute("StudentFeesPaymentDetails_OnlyPaid").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student Payment details not found"
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

router.post('/getFeesPaymentMaxId', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("StudentFeesPaymentDetails_getMaxId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student payment details not found!!!"
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

router.post('/setStudentFeesPayment', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('StudentId', sql.Int, parseInt(field.StudentId, 10));
                request.input('FeesTemplateFeesAccountMappingId', sql.Int, parseInt(field.FeesTemplateFeesAccountMappingId, 10));
                request.input('Date', sql.VarChar, field.Date);
                request.input('Description', sql.VarChar, field.Description);
                request.input('PaymentMethodId', sql.Int, parseInt(field.PaymentMethodId, 10));
                request.input('IncomeAccountId', sql.Int, parseInt(field.IncomeAccountId, 10));
                request.input('Amount', sql.Int, parseInt(field.Amount, 10));
                request.input('ReceiptNumber', sql.VarChar, field.ReceiptNumber);
                request.input('Discount', sql.Int, parseInt(field.Discount, 10));
                request.input('EmployeeId', sql.Int, parseInt(field.EmployeeId, 10));
                request.execute("StudentFeesPaymentDetails_CreateOrUpdate").then(function (results) {
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
                    message: "Error while updating Student Payment Details."
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

router.post('/setStudentInfo', function (req, res) {
    console.log(req.body);
    let Id = req.body.Id;
    let Name = req.body.Name;
    let InstitutionId = req.body.InstitutionId;
    let StudentCode = req.body.StudentCode;
    let ApplicationNumber = req.body.ApplicationNumber;
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;
    let DateOfBirth = req.body.DateOfBirth;
    let AdmissionNo = req.body.AdmissionNo;
    let AdmissionDate = req.body.AdmissionDate;
    let Gender = req.body.Gender;
    let ReligionId = req.body.ReligionId;
    let CasteId = req.body.CasteId;
    let SubCasteId = req.body.SubCasteId;
    let ReservationCategoryId = req.body.ReservationCategoryId;
    let MediumId = req.body.MediumId;
    let PresentAddress = req.body.PresentAddress;
    let PermanentAddress = req.body.PermanentAddress;
    let PhoneNumber = req.body.PhoneNumber;
    let ParentId = req.body.ParentId;
    let BloodGroup = req.body.BloodGroup;
    let PhysicallyChallenged = req.body.PhysicallyChallenged;
    let PatternId = req.body.PatternId;
    let CurrentClassSectionMediumId = req.body.CurrentClassSectionMediumId;
    let Active = req.body.Active;
    let UserName = req.body.UserName;
    let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
    let AcademicYearId = req.body.AcademicYearId;
    let AccountingYearId = req.body.AccountingYearId;
    let ClassId = req.body.ClassId;
    let PreviousOrganization = req.body.PreviousOrganization;
    let PreviousOrganizationTcNo = req.body.PreviousOrganizationTcNo;
    let AadhaarNumber = req.body.AadhaarNumber;
    let Nationality = req.body.Nationality;
    let MotherTongue = req.body.MotherTongue;
    let StudentQuotaId = req.body.StudentQuotaId;
    let RollNumber = req.body.RollNumber;
    let SubjectCombinationId = req.body.SubjectCombinationId;
    let FeeTemplateId = req.body.FeeTemplateId;
    let MergeAddonAndOrgFees = req.body.MergeAddonAndOrgFees;
    let AdmissionCategoryId = req.body.AdmissionCategoryId;
    let PlaceofBirth = req.body.PlaceofBirth;
    let FatherName = req.body.FatherName;
    let MotherName = req.body.MotherName;
    let FatherEducation = req.body.FatherEducation;
    let MotherEducation = req.body.MotherEducation;
    let FatherOccupation = req.body.FatherOccupation;
    let MotherOccupation = req.body.MotherOccupation;
    let AnnualIncome = req.body.AnnualIncome;
    let AlternatePhoneNumber = req.body.AlternatePhoneNumber;
    let Address = req.body.Address;
    let RollNumberAcademicYear = req.body.RollNumberAcademicYear;
    let EmailId = req.body.EmailId;
    console.log(FatherOccupation);
    console.log(MotherOccupation);


    try {
        if (Id == "") throw "Id is empty";
        if (Name == "") throw "Name is empty";
        if (InstitutionId == "") throw "InstitutionId is empty";
        if (StudentCode == "") throw "StudentCode is empty";
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        if (FirstName == "") throw "FirstName is empty";
        if (LastName == "") throw "LastName is empty";
        if (DateOfBirth == "") throw "DateOfBirth is empty";
        if (AdmissionNo == "") throw "AdmissionNo is empty";
        if (AdmissionDate == "") throw "AdmissionDate is empty";
        if (Gender == "") throw "Gender is empty";
        if (ReligionId == "") throw "ReligionId is empty";
        if (CasteId == "") throw "CasteId is empty";
        if (SubCasteId == "") throw "SubCasteId is empty";
        if (ReservationCategoryId == "") throw "ReservationCategoryId is empty";
        if (MediumId == "") throw "MediumId is empty";
        if (PresentAddress == "") throw "PresentAddress is empty";
        if (PermanentAddress == "") throw "PermanentAddress is empty";
        if (PhoneNumber == "") throw "PhoneNumber is empty";
        if (ParentId == "") throw "ParentId is empty";
        if (BloodGroup == "") throw "BloodGroup is empty";
        if (PhysicallyChallenged == "") throw "PhysicallyChallenged is empty";
        if (PatternId == "") throw "PatternId is empty";
        if (CurrentClassSectionMediumId == "") throw "CurrentClassSectionMediumId is empty";
        if (Active == "") throw "Active is empty";
        if (UserName == "") throw "UserName is empty";
        if (EmailId == "") throw "EmailId is empty";
        if (AlternativePhoneNumber == "") throw "AlternativePhoneNumber is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (ClassId == "") throw "ClassId is empty";
        if (FatherName == "") throw "FatherName is empty";
        if (MotherName == "") throw "MotherName is empty";
        if (FatherEducation == "") throw "FatherEducation is empty";
        if (MotherEducation == "") throw "MotherEducation is empty";
        if (FatherOccupation == "") throw "FatherOccupation is empty";
        if (MotherOccupation == "") throw "MotherOccupation is empty";
        if (AnnualIncome == "") throw "AnnualIncome is empty";
        if (AlternatePhoneNumber == "") throw "AlternatePhoneNumber is empty";
        if (Address == "") throw "Address is empty";
        if (PreviousOrganization == "") throw "PreviousOrganization is empty";
        if (PlaceofBirth == "") throw "PlaceofBirth is empty";
        if (AadhaarNumber == "") throw "AadhaarNumber is empty";
        if (Nationality == "") throw "Nationality is empty";
        if (MotherTongue == "") throw "MotherTongue is empty";
        if (StudentQuotaId == "") throw "StudentQuotaId is empty";
        if (PreviousOrganizationTcNo == "") throw "PreviousOrganizationTcNo is empty";
        if (RollNumber == "") throw "RollNumber is empty";
        if (SubjectCombinationId == "") throw "SubjectCombinationId is empty";
        if (FeeTemplateId == "") throw "FeeTemplateId is empty";
        if (MergeAddonAndOrgFees == "") throw "MergeAddonAndOrgFees is empty";
        if (AdmissionCategoryId == "") throw "AdmissionCategoryId is empty";
        if (RollNumberAcademicYear == "") throw "RollNumberAcademicYear is empty";
        if (AccountingYearId == "") throw "AccountingYear is empty";


        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('Name', sql.VarChar, Name);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.input('StudentCode', sql.VarChar, StudentCode);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.input('FirstName', sql.VarChar, FirstName);
            request.input('LastName', sql.VarChar, LastName);
            request.input('DateOfBirth', sql.VarChar, DateOfBirth);
            request.input('AdmissionNo', sql.VarChar, AdmissionNo);
            request.input('AdmissionDate', sql.VarChar, AdmissionDate);
            request.input('Gender', sql.VarChar, Gender);
            request.input('ReligionId', sql.Int, parseInt(ReligionId, 10));
            request.input('CasteId', sql.Int, parseInt(CasteId, 10));
            request.input('SubCasteId', sql.Int, parseInt(SubCasteId, 10));
            request.input('ReservationCategoryId', sql.Int, parseInt(ReservationCategoryId, 10));
            request.input('MediumId', sql.Int, parseInt(MediumId, 10));
            request.input('PresentAddress', sql.VarChar, PresentAddress);
            request.input('PermanentAddress', sql.VarChar, PermanentAddress);
            request.input('PhoneNumber', sql.VarChar, PhoneNumber);
            request.input('ParentId', sql.Int, parseInt(ParentId, 10));
            request.input('BloodGroup', sql.VarChar, BloodGroup);
            request.input('PhysicallyChallenged', sql.VarChar, PhysicallyChallenged);
            request.input('PatternId', sql.Int, parseInt(PatternId, 10));
            request.input('CurrentClassSectionMediumId', sql.Int, parseInt(CurrentClassSectionMediumId, 10));
            request.input('Active', sql.VarChar, Active);
            request.input('UserName', sql.VarChar, UserName);
            request.input('EmailId', sql.VarChar, EmailId);
            request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('AccountingYearId', sql.Int, parseInt(AccountingYearId, 10));
            request.input('ClassId', sql.Int, parseInt(ClassId, 10));
            request.input('FatherName', sql.VarChar, FatherName);
            request.input('MotherName', sql.VarChar, MotherName);
            request.input('FatherEducation', sql.VarChar, FatherEducation);
            request.input('MotherEducation', sql.VarChar, MotherEducation);
            request.input('FatherOccupation', sql.VarChar, FatherOccupation);
            request.input('MotherOccupation', sql.VarChar, MotherOccupation);
            request.input('AnnualIncome', sql.Int, parseInt(AnnualIncome, 10));
            request.input('AlternatePhoneNumber', sql.VarChar, AlternatePhoneNumber);
            request.input('PreviousOrganization', sql.VarChar, PreviousOrganization);
            request.input('PlaceofBirth', sql.VarChar, PlaceofBirth);
            request.input('AadhaarNumber', sql.VarChar, AadhaarNumber);
            request.input('Nationality', sql.VarChar, Nationality);
            request.input('MotherTongue', sql.VarChar, MotherTongue);
            request.input('StudentQuotaId', sql.Int, parseInt(StudentQuotaId, 10));
            request.input('PreviousOrganizationTcNo', sql.VarChar, PreviousOrganizationTcNo);
            request.input('RollNumber', sql.VarChar, RollNumber);
            request.input('SubjectCombinationId', sql.Int, parseInt(SubjectCombinationId, 10));
            request.input('FeeTemplateId', sql.Int, parseInt(FeeTemplateId, 10));
            request.input('MergeAddonAndOrgFees', sql.VarChar, MergeAddonAndOrgFees);
            request.input('AdmissionCategoryId', sql.Int, parseInt(AdmissionCategoryId, 10));
            request.input('Address', sql.VarChar, Address);
            request.input('RollNumberAcademicYear', sql.VarChar, RollNumberAcademicYear);

            request.execute("StudentAndParent_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while Admitting the Student.",
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

router.post('/setStudentPromote', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('CurrentClassSectionMediumId', sql.Int, parseInt(field.CurrentClassSectionMediumId, 10));
                request.input('AcademicYearId', sql.Int, parseInt(field.AcademicYearId, 10));
                request.input('ClassId', sql.Int, parseInt(field.ClassId, 10));
                request.execute("Student_Promote").then(function (results) {
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
                    message: "Error while updating StudentPromote."
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

router.post('/setIsAdmissionPending', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    let IsAdmissionPending = req.body.IsAdmissionPending;

    try {
        //console.log('IsAdmissionPending ===>' + IsAdmissionPending);
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        //if (IsAdmissionPending == "") throw "IsAdmissionPending is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.input('IsAdmissionPending', sql.VarChar, IsAdmissionPending);

            request.execute("IsAdmissionPending_Update").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating IsAdmissionPending.",
                        results: results
                    });
                } else {
                    res.send({
                        success: true,
                        message: "Successfully updated Student IsAdmissionPending Status.",
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


router.post('/setActiveUpdate', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    let Active = req.body.Active;

    try {
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        //if (Active == "") throw "Active is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.input('Active', sql.VarChar, Active);

            request.execute("Active_Update").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Active Update.",
                        results: results
                    });
                } else {
                    res.send({
                        success: true,
                        message: "Successfully updated Student Active Status.",
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

router.post('/setStudentPromote', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('CurrentClassSectionMediumId', sql.Int, parseInt(field.CurrentClassSectionMediumId, 10));
                request.input('AcademicYearId', sql.Int, parseInt(field.AcademicYearId, 10));
                request.input('ClassId', sql.Int, parseInt(field.ClassId, 10));
                request.execute("Student_Promote").then(function (results) {
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
                    message: "Error while updating StudentPromote."
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
router.post('/setPassedOut', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('PassedOut', sql.VarChar, field.PassedOut);

                request.execute("Student_passedOut").then(function (results) {
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
                    message: "Error while updating Student Passed Out."
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

router.post('/setDroppedOut', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('DroppedOut', sql.VarChar, field.DroppedOut);

                request.execute("Student_droppedOut").then(function (results) {
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
                    message: "Error while updating Student Dropped Out."
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

router.post('/setApproved', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                request.input('Approved', sql.VarChar, field.Approved);

                request.execute("Student_Approved").then(function (results) {
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
                    message: "Error while updating Student Approved."
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

// router.post('/delStudent', function (req, res) {
//     let Id = req.body.Id;
//     try {
//         if (Id == "") throw "Id is empty";

//         var dbConn = new sql.ConnectionPool(localconfig);
//         dbConn.connect().then(function () {
//             var request = new sql.Request(dbConn);
//             request.input('Id', parseInt(Id, 10));

//             request.execute("Student_delete").then(function (results) {
//                 console.log(results);
//                 console.log(Id);

//                 if (results.returnValue != 0) {
//                     res.send({
//                         success: false,
//                         message: "Error while deleting Student",
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

router.post('/delStudent', function (req, res) {
    let fieldArray = req.body.fieldArray;
    let errorInForLop = false;
    try {
        if (fieldArray == "") throw "fieldArray is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            fieldArray.forEach(function (field) {
                console.log('field ===>');
                console.log(field);
                var request = new sql.Request(dbConn);
                request.input('Id', sql.Int, parseInt(field.Id, 10));
                // request.input('Approved', sql.VarChar, field.Approved);

                request.execute("Student_delete").then(function (results) {
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
                    message: "Error while updating Student Approved."
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

router.post('/UpdateStudentImagePath', function (req, res) {
    let Id = req.body.Id;
    let ImagePath = req.body.ImagePath;

    try {
        if (Id == "") throw "Id is empty";
        if (ImagePath == "") throw "ImagePath is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('ImagePath', sql.VarChar, ImagePath);

            request.execute("Student_UpdateImagePath").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Students ImagePath.",
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


router.post('/studentimport', function (req, res) {
    console.log(req.body);
    let Id = req.body.Id;
    let Name = req.body.Name;
    let InstitutionId = req.body.InstitutionId;
    let DateOfBirth = req.body.DateOfBirth;
    let Gender = req.body.Gender;
    let Religion = req.body.Religion;
    let Caste = req.body.Caste;
    let ReservationCategory = req.body.ReservationCategory;
    let PresentAddress = req.body.PresentAddress;
    let PhoneNumber = req.body.PhoneNumber;
    let CurrentClassSectionMediumId = req.body.CurrentClassSectionMediumId;
    let ClassId = req.body.ClassId;
    let Active = req.body.Active;
    let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
    let AcademicYearId = req.body.AcademicYearId;
    let AccountingYearId = req.body.AccountingYearId;
    let FatherName = req.body.FatherName;
    let MotherName = req.body.MotherName;
    let ParentPhoneNumber = req.body.ParentPhoneNumber;
    let ParentAlternatePhoneNumber = req.body.ParentAlternatePhoneNumber;
    let AadhaarNumber = req.body.AadhaarNumber;
    let Nationality = req.body.Nationality;
    let RollNumber = req.body.RollNumber;
    let AdmissionCategory = req.body.AdmissionCategory;

    let ApplicationDate = req.body.ApplicationDate;
    let Description = req.body.Description;
    let Status = req.body.Status;
    let IsAdmissionPending = req.body.IsAdmissionPending;

    try {
        if (Id == "") throw "Id is empty";
        if (Name == "") throw "Name is empty";
        if (InstitutionId == "") throw "InstitutionId is empty";
        if (DateOfBirth == "") throw "DateOfBirth is empty";
        if (Gender == "") throw "Gender is empty";
        if (Religion == "") throw "Religion is empty";
        if (Caste == "") throw "Caste is empty";
        //if (ReservationCategory == "") throw "ReservationCategory is empty";
        if (PresentAddress == "") throw "PresentAddress is empty";
        if (PhoneNumber == "") throw "PhoneNumber is empty";
        if (CurrentClassSectionMediumId == "") throw "CurrentClassSectionMediumId is empty";
        if (ClassId == "") throw "ClassId is empty";
        if (Active == "") throw "Active is empty";
        if (AlternativePhoneNumber == "") throw "AlternativePhoneNumber is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (AccountingYearId == "") throw "AccountingYearId is empty";
        if (FatherName == "") throw "FatherName is empty";
        if (MotherName == "") throw "MotherName is empty";
        if (ParentPhoneNumber == "") throw "ParentPhoneNumber is empty";
        if (ParentAlternatePhoneNumber == "") throw "ParentAlternatePhoneNumber is empty";
        if (AadhaarNumber == "") throw "AadhaarNumber is empty";
        if (Nationality == "") throw "Nationality is empty";
        if (RollNumber == "") throw "RollNumber is empty";
        //if (AdmissionCategory == "") throw "AdmissionCategory is empty";
        if (ApplicationDate == "") throw "ApplicationDate is empty";
        if (Description == "") throw "Description is empty";
        if (Status == "") throw "Status is empty";
        //if (IsAdmissionPending == "") throw "IsAdmissionPending is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('Name', sql.VarChar, Name);
            request.input('InstitutionId', sql.VarChar, InstitutionId);
            request.input('DateOfBirth', sql.VarChar, DateOfBirth);
            request.input('Gender', sql.VarChar, Gender);
            request.input('Religion', sql.VarChar, Religion);
            request.input('Caste', sql.VarChar, Caste);
            request.input('ReservationCategory', sql.VarChar, ReservationCategory);
            request.input('PresentAddress', sql.VarChar, PresentAddress);
            request.input('PhoneNumber', sql.VarChar, PhoneNumber);
            request.input('CurrentClassSectionMediumId', sql.Int, parseInt(CurrentClassSectionMediumId, 10));
            request.input('ClassId', sql.Int, parseInt(ClassId, 10));
            request.input('Active', sql.VarChar, Active);
            request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
            request.input('AcademicYearId', sql.VarChar, AcademicYearId);
            request.input('AccountingYearId', sql.VarChar, AccountingYearId);
            request.input('FatherName', sql.VarChar, FatherName);
            request.input('MotherName', sql.VarChar, MotherName);
            request.input('ParentPhoneNumber', sql.VarChar, ParentPhoneNumber);
            request.input('ParentAlternatePhoneNumber', sql.VarChar, ParentAlternatePhoneNumber);
            request.input('AadhaarNumber', sql.VarChar, AadhaarNumber);
            request.input('Nationality', sql.VarChar, Nationality);
            request.input('RollNumber', sql.VarChar, RollNumber);
            request.input('AdmissionCategory', sql.VarChar, AdmissionCategory);
            request.input('ApplicationDate', sql.VarChar, ApplicationDate);
            request.input('Description', sql.VarChar, Description);
            request.input('Status', sql.VarChar, Status);
            request.input('IsAdmissionPending', sql.VarChar, IsAdmissionPending);

            request.execute("Student_Parent_Import").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while Importing Student.",
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
