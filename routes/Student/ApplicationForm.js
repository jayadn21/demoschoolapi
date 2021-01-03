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

router.post('/getapplicationforms', function (req, res) {

    try {

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("ApplicationForm_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Employee details not found"
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
router.post('/getapplicationform', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    try {
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.execute("ApplicationForm_selectByApplicationNumber").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Application Form details not found"
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
router.post('/deleteapplicationform', function (req, res) {
    let ApplicationNumber = req.body.ApplicationNumber;
    try {
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.execute("ApplicationForm_deleteByApplicationNumber").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting Application Form.",
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
For new record, send Id as -1 else to update existing record, send Id with existing value.
{
        "ApplicationNumber":"",
        "ApplicationDate":"",
        "InstitutionId":"",
        "AcademicYearId":"",
        "IncomeAccountId":"",
        "Description":"",
        "FeesAccountId":"",
        "PaymentMethodId":"",
        "Amount":"",
        "Status":"",
        "IsAdmissionPending":"",
        "StudentName":"",
        "FatherName":"",
        "MotherName":"",
        "Gender":"",
        "PhoneNumber":"",
        "AlternativePhoneNumber":"",
        "PresentAddress":"",
        "ClassId":"",
        "PreviousOrganization":"",
        "AddOnFacilityIds":"",
        "ApplicationFeesAcademicYearId":""
    }
*/
router.post('/setapplicationform', function (req, res) {
    let Id = req.body.Id;
    let ApplicationNumber = req.body.ApplicationNumber;
    let ApplicationDate = req.body.ApplicationDate;
    let InstitutionId = req.body.InstitutionId;
    let AcademicYearId = req.body.AcademicYearId;
    let AccountingYearId = req.body.AccountingYearId;
    let IncomeAccountId = req.body.IncomeAccountId;
    let Description = req.body.Description;
    let FeesAccountId = req.body.FeesAccountId;
    let PaymentMethodId = req.body.PaymentMethodId;
    let Amount = req.body.Amount;
    let Status = req.body.Status;
    let IsAdmissionPending = req.body.IsAdmissionPending;
    let StudentName = req.body.Name;
    let FatherName = req.body.FatherName;
    let MotherName = req.body.MotherName;
    let Gender = req.body.Gender;
    let PhoneNumber = req.body.PhoneNumber;
    let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
    let PresentAddress = req.body.PresentAddress;
    let ClassId = req.body.ClassId;
    let PreviousOrganization = req.body.PreviousOrganization;
    let AddOnFacilityIds = req.body.AddOnFacilityIds;
    let ApplicationFeesAcademicYearId = req.body.ApplicationFeesAcademicYearId;
    try {
        if (Id == "") throw "Id is empty";
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        if (ApplicationDate == "") throw "ApplicationDate is empty";
        if (InstitutionId == "") throw "InstitutionId is empty";
        if (AcademicYearId == "") throw "AcademicYearId is empty";
        if (AccountingYearId == "") throw "AccountingYearId is empty";
        if (IncomeAccountId == "") throw "IncomeAccountId is empty";
        if (Description == "") throw "Description is empty";
        if (FeesAccountId == "") throw "FeesAccountId is empty";
        if (PaymentMethodId == "") throw "PaymentMethodId is empty";
        if (Amount == "") throw "Amount is empty";
        if (Status == "") throw "Status is empty";
        if (IsAdmissionPending == "") throw "IsAdmissionPending is empty";
        if (StudentName == "") throw "StudentName is empty";
        if (FatherName == "") throw "FatherName is empty";
        if (MotherName == "") throw "MotherName is empty";
        if (Gender == "") throw "Gender is empty";
        if (PhoneNumber == "") throw "PhoneNumber is empty";
        if (AlternativePhoneNumber == "") throw "AlternativePhoneNumber is empty";
        if (PresentAddress == "") throw "PresentAddress is empty";
        if (ClassId == "") throw "ClassId is empty";
        if (PreviousOrganization == "") throw "PreviousOrganization is empty";
        //if (AddOnFacilityIds == "") throw "AddOnFacilityIds is empty";
        if (ApplicationFeesAcademicYearId == "") throw "ApplicationFeesAcademicYearId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
            request.input('ApplicationDate', sql.VarChar, ApplicationDate);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('AccountingYearId', sql.Int, parseInt(AccountingYearId, 10));
            request.input('IncomeAccountId', sql.Int, parseInt(IncomeAccountId, 10));
            request.input('Description', sql.VarChar, Description);
            request.input('FeesAccountId', sql.Int, parseInt(FeesAccountId, 10));
            request.input('PaymentMethodId', sql.Int, parseInt(PaymentMethodId, 10));
            request.input('Amount', sql.Int, parseInt(Amount, 10));
            request.input('Status', sql.VarChar, Status);
            request.input('IsAdmissionPending', sql.VarChar, IsAdmissionPending);
            request.input('StudentName', sql.VarChar, StudentName);
            request.input('FatherName', sql.VarChar, FatherName);
            request.input('MotherName', sql.VarChar, MotherName);
            request.input('Gender', sql.VarChar, Gender);
            request.input('PhoneNumber', sql.VarChar, PhoneNumber);
            request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
            request.input('PresentAddress', sql.VarChar, PresentAddress);
            request.input('ClassId', sql.Int, parseInt(ClassId, 10));
            request.input('PreviousOrganization', sql.VarChar, PreviousOrganization);
            request.input('AddOnFacilityIds', sql.VarChar, AddOnFacilityIds);
            request.input('ApplicationFeesAcademicYearId', sql.Int, parseInt(ApplicationFeesAcademicYearId, 10));

            request.execute("ApplicationForm_CreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Application Form.",
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
"Id":"",
"Name":"",
"InstitutionId":"",
"StudentCode":"",
"ApplicationNumber":"",
"FirstName":"",
"LastName":"",
"DateOfBirth":"",
"AdmissionNo":"",
"AdmissionDate":"",
"Gender":"",
"ReligionId":"",
"CasteId":"",
"SubCasteId":"",
"ReservationCategoryId":"",
"MediumId":"",
"PresentAddress":"",
"PermanentAddress":"",
"PhoneNumber":"",
"ParentId":"",
"BloodGroup":"",
"PhysicallyChallenged":"",
"PatternId":"",
"CurrentClassSectionMediumId":"",
"Active":"",
"UserName":"",
"EmailId":"",
"Password":"",
"AlternativePhoneNumber":"",
"AcademicYearId":"",
"ClassId":"",
"FatherName":"",
"MotherName":"",
"FatherEducation":"",
"MotherEducation":"",
"FatherOccupation":"",
"MotherOccupation":"",
"AnnualIncome":"",
"ParentPhoneNumber":"",
"ParentAlternatePhoneNumber":"",
"ParentEmailId":"",
"PreviousOrganization":"",
"PlaceofBirth":"",
"AadhaarNumber":"",
"Nationality":"",
"MotherTongue":"",
"StudentQuotaId":"",
"PreviousOrganizationTcNo":"",
"RollNumber":"",
"SubjectCombinationId":"",
"FeeTemplateId":"",
"MergeAddonAndOrgFees":"",
"AdmissionCategoryId":"",
"RollNumberAcademicYear":""
*/
// router.post('/makeadmission', function (req, res) {
//     let Id = req.body.Id;
//     let Name = req.body.StudentName;
//     let InstitutionId = req.body.InstitutionId;
//     let StudentCode = req.body.StudentCode;
//     let ApplicationNumber = req.body.ApplicationNumber;
//     let FirstName = req.body.FirstName;
//     let LastName = req.body.LastName;
//     let DateOfBirth = req.body.DateOfBirth;
//     let AdmissionNo = req.body.AdmissionNo;
//     let AdmissionDate = req.body.AdmissionDate;
//     let Gender = req.body.Gender;
//     let ReligionId = req.body.ReligionId;
//     let CasteId = req.body.CasteId;
//     let SubCasteId = req.body.SubCasteId;
//     let ReservationCategoryId = req.body.ReservationCategoryId;
//     let MediumId = req.body.MediumId;
//     let PresentAddress = req.body.PresentAddress;
//     let PermanentAddress = req.body.PermanentAddress;
//     let PhoneNumber = req.body.PhoneNumber;
//     let ParentId = req.body.ParentId;
//     let BloodGroup = req.body.BloodGroup;
//     let PhysicallyChallenged = req.body.PhysicallyChallenged;
//     let PatternId = req.body.PatternId;
//     let CurrentClassSectionMediumId = req.body.CurrentClassSectionMediumId;
//     let Active = req.body.Active;
//     let UserName = req.body.UserName;
//     let EmailId = req.body.EmailId;
//     let Password = req.body.Password;
//     let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
//     let AcademicYearId = req.body.AcademicYearId;
//     let ClassId = req.body.ClassId;
//     let FatherName = req.body.FatherName;
//     let MotherName = req.body.MotherName;
//     let FatherEducation = req.body.FatherEducation;
//     let MotherEducation = req.body.MotherEducation;
//     let FatherOccupation = req.body.FatherOccupation;
//     let MotherOccupation = req.body.MotherOccupation;
//     let AnnualIncome = req.body.AnnualIncome;
//     let ParentPhoneNumber = req.body.ParentPhoneNumber;
//     let ParentAlternatePhoneNumber = req.body.ParentAlternatePhoneNumber;
//     let ParentEmailId = req.body.ParentEmailId;
//     let PreviousOrganization = req.body.PreviousOrganization;
//     let PlaceofBirth = req.body.PlaceofBirth;
//     let AadhaarNumber=req.body.AadhaarNumber;
//     let Nationality=req.body.Nationality;
//     let MotherTongue=req.body.MotherTongue;
//     let StudentQuotaId=req.body.StudentQuotaId;
//     let PreviousOrganizationTcNo=req.body.PreviousOrganizationTcNo;
//     let RollNumber=req.body.RollNumber;
//     let SubjectCombinationId=req.body.SubjectCombinationId;
//     let FeeTemplateId=req.body.FeeTemplateId;
//     let MergeAddonAndOrgFees=req.body.MergeAddonAndOrgFees;
//     let AdmissionCategoryId=req.body.AdmissionCategoryId;
//     let RollNumberAcademicYear=req.body.RollNumberAcademicYear;

//     try {
//         if (Id == "") throw "Id is empty";
//         if (Name == "") throw "Name is empty";
//         if (InstitutionId == "") throw "InstitutionId is empty";
//         if (StudentCode == "") throw "StudentCode is empty";
//         if (ApplicationNumber == "") throw "ApplicationNumber is empty";
//         if (FirstName == "") throw "FirstName is empty";
//         if (LastName == "") throw "LastName is empty";
//         if (DateOfBirth == "") throw "DateOfBirth is empty";
//         if (AdmissionNo == "") throw "AdmissionNo is empty";
//         if (AdmissionDate == "") throw "AdmissionDate is empty";
//         if (Gender == "") throw "Gender is empty";
//         if (ReligionId == "") throw "ReligionId is empty";
//         if (CasteId == "") throw "CasteId is empty";
//         if (SubCasteId == "") throw "SubCasteId is empty";
//         if (ReservationCategoryId == "") throw "ReservationCategoryId is empty";
//         if (MediumId == "") throw "MediumId is empty";
//         if (PresentAddress == "") throw "PresentAddress is empty";
//         if (PermanentAddress == "") throw "PermanentAddress is empty";
//         if (PhoneNumber == "") throw "PhoneNumber is empty";
//         if (ParentId == "") throw "ParentId is empty";
//         if (BloodGroup == "") throw "BloodGroup is empty";
//         if (PhysicallyChallenged == "") throw "PhysicallyChallenged is empty";
//         if (PatternId == "") throw "PatternId is empty";
//         if (CurrentClassSectionMediumId == "") throw "CurrentClassSectionMediumId is empty";
//         if (Active == "") throw "Active is empty";
//         if (UserName == "") throw "UserName is empty";
//         if (EmailId == "") throw "EmailId is empty";
//         if (Password == "") throw "Password is empty";
//         if (AlternativePhoneNumber == "") throw "AlternativePhoneNumber is empty";
//         if (AcademicYearId == "") throw "AcademicYearId is empty";
//         if (ClassId == "") throw "ClassId is empty";
//         if (FatherName == "") throw "FatherName is empty";
//         if (MotherName == "") throw "MotherName is empty";
//         if (FatherEducation == "") throw "FatherEducation is empty";
//         if (MotherEducation == "") throw "MotherEducation is empty";
//         if (FatherOccupation == "") throw "FatherOccupation is empty";
//         if (MotherOccupation == "") throw "MotherOccupation is empty";
//         if (AnnualIncome == "") throw "AnnualIncome is empty";
//         if (ParentPhoneNumber == "") throw "ParentPhoneNumber is empty";
//         if (ParentAlternatePhoneNumber == "") throw "ParentAlternatePhoneNumber is empty";
//         if (ParentEmailId == "") throw "ParentEmailId is empty";
//         if(PreviousOrganization == "") throw "PreviousOrganization is empty";
//         if(PlaceofBirth == "") throw "PlaceofBirth is emptyp";
//         if(AadhaarNumber == "") throw "AadhaarNumber is empty";
//         if(Nationality == "") throw "Nationality is empty";
//         if(MotherTongue == "") throw "MotherTongue is empty";
//         if(StudentQuotaId == "") throw "StudentQuotaId is empty";
//         if(PreviousOrganizationTcNo == "") throw "PreviousOrganizationTcNo is empty";
//         if(RollNumber == "") throw "RollNumber is empty";
//         if(SubjectCombinationId == "") throw "SubjectCombinationId is empty";
//         if(FeeTemplateId == "") throw "FeeTemplateId is empty";
//         if(MergeAddonAndOrgFees == "") throw "MergeAddonAndOrgFees is empty";
//         if(AdmissionCategoryId == "") throw "AdmissionCategoryId is empty";
//         if(RollNumberAcademicYear == "") throw "RollNumberAcademicYear is empty";

//         var dbConn = new sql.ConnectionPool(localconfig);
//         dbConn.connect().then(function () {
//             var request = new sql.Request(dbConn);
//             request.input('Id', sql.Int, parseInt(Id, 10));
//             request.input('Name', sql.VarChar, Name);
//             request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
//             request.input('StudentCode', sql.VarChar, StudentCode);
//             request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
//             request.input('FirstName', sql.VarChar, FirstName);
//             request.input('LastName', sql.VarChar, LastName);
//             request.input('DateOfBirth', sql.VarChar, DateOfBirth);
//             request.input('AdmissionNo', sql.VarChar, AdmissionNo);
//             request.input('AdmissionDate', sql.VarChar, AdmissionDate);
//             request.input('Gender', sql.VarChar, Gender);
//             request.input('ReligionId', sql.Int, parseInt(ReligionId, 10));
//             request.input('CasteId', sql.Int, parseInt(CasteId, 10));
//             request.input('SubCasteId', sql.Int, parseInt(SubCasteId, 10));
//             request.input('ReservationCategoryId', sql.Int, parseInt(ReservationCategoryId, 10));
//             request.input('MediumId', sql.Int, parseInt(MediumId, 10));
//             request.input('PresentAddress', sql.VarChar, PresentAddress);
//             request.input('PermanentAddress', sql.VarChar, PermanentAddress);
//             request.input('PhoneNumber', sql.VarChar, PhoneNumber);
//             request.input('ParentId', sql.Int, parseInt(ParentId, 10));
//             request.input('BloodGroup', sql.VarChar, BloodGroup);
//             request.input('PhysicallyChallenged', sql.VarChar, PhysicallyChallenged);
//             request.input('PatternId', sql.Int, parseInt(PatternId, 10));
//             request.input('CurrentClassSectionMediumId', sql.Int, parseInt(CurrentClassSectionMediumId, 10));
//             request.input('Active', sql.VarChar, Active);
//             request.input('UserName', sql.VarChar, UserName);
//             request.input('EmailId', sql.VarChar, EmailId);
//             request.input('Password', sql.VarChar, Password);
//             request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
//             request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
//             request.input('ClassId', sql.Int, parseInt(ClassId, 10));
//             request.input('FatherName', sql.VarChar, FatherName);
//             request.input('MotherName', sql.VarChar, MotherName);
//             request.input('FatherEducation', sql.VarChar, FatherEducation);
//             request.input('MotherEducation', sql.VarChar, MotherEducation);
//             request.input('FatherOccupation', sql.VarChar, FatherOccupation);
//             request.input('MotherOccupation', sql.VarChar, MotherOccupation);
//             request.input('AnnualIncome', sql.Int, parseInt(AnnualIncome, 10));
//             request.input('ParentPhoneNumber', sql.VarChar, ParentPhoneNumber);
//             request.input('ParentAlternatePhoneNumber', sql.VarChar, ParentAlternatePhoneNumber);
//             request.input('ParentEmailId', sql.VarChar, ParentEmailId);
//             request.input('PreviousOrganization', sql.VarChar, PreviousOrganization);
//             request.input('PlaceofBirth', sql.VarChar, PlaceofBirth);
//             request.input('AadhaarNumber', sql.VarChar, AadhaarNumber);
//             request.input('Nationality', sql.VarChar, Nationality);
//             request.input('MotherTongue', sql.VarChar, MotherTongue);
//             request.input('StudentQuotaId', sql.Int, parseInt(StudentQuotaId, 10));
//             request.input('PreviousOrganizationTcNo', sql.VarChar, PreviousOrganizationTcNo);
//             request.input('RollNumber', sql.VarChar, RollNumber);
//             request.input('SubjectCombinationId', sql.Int, parseInt(SubjectCombinationId, 10));
//             request.input('FeeTemplateId', sql.Int, parseInt(FeeTemplateId, 10));
//             request.input('MergeAddonAndOrgFees', sql.VarChar, MergeAddonAndOrgFees);
//             request.input('AdmissionCategoryId', sql.Int, parseInt(AdmissionCategoryId, 10));
//             request.input('RollNumberAcademicYear', sql.VarChar, RollNumberAcademicYear);

//             request.execute("MakeAdmissionCreate").then(function (results) {
//                 console.log(results);

//                 if (results.returnValue != 0) {
//                     res.send({
//                         success: false,
//                         message: "Error while Admitting the Student.",
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
//  Id int
// 	StudentName varchar(254)
// 	InstitutionId int
// 	ApplicationNumber varchar(254)
// 	ApplicationDate varchar(254)
// 	AcademicYearId int
// 	IncomeAccountId int
// 	Description varchar(254)
// 	FeesAccountId int
// 	PaymentMethodId int
// 	Amount varchar(254)
// 	Status varchar(254)
// 	StudentCode varchar(254)
// 	FirstName varchar(254)
// 	LastName varchar(254)
// 	FatherName varchar(254)
// 	MotherName varchar(254)
// 	DateOfBirth varchar(254)
// 	AdmissionNo varchar(254)
// 	AdmissionDate varchar(254)
// 	Gender varchar(254)
// 	GenderStr varchar(254)
// 	ReligionId int
// 	CasteId int
// 	SubCasteId int
// 	ReservationCategoryId int
// 	MediumId int
// 	PresentAddress varchar(254)
// 	PermanentAddress varchar(254)
// 	PhoneNumber varchar(254)
// 	ParentId int
// 	BloodGroup varchar(254)
// 	PhysicallyChallenged varchar(254)
// 	PatternId int
// 	CurrentClassSectionMediumId varchar(254)
// 	Active varchar(254)
// 	UserName varchar(254)
// 	AlternativePhoneNumber varchar(254)
// 	ClassId int
// 	Class varchar(254)
// 	AcademicYear varchar(254)
// 	IsAdmissionPending bit
// 	PreviousOrganization varchar(254)
// 	AddOnFacilityIds varchar(254)
// 	ApplicationFeesAcademicYearId int
// 	EmailId varchar(254)
// 	FatherEducation varchar(254)
// 	MotherEducation varchar(254)
// 	FatherOccupation varchar(254)
// 	MotherOccupation varchar(254)
// 	AnnualIncome int
// 	ParentPhoneNumber varchar(254)
// 	ParentAlternatePhoneNumber varchar(254)
// 	ParentEmailId varchar(254)
// 	PlaceofBirth varchar(254)
// 	AadhaarNumber varchar(254)
// 	Nationality varchar(254)
// 	MotherTongue varchar(254)
// 	StudentQuotaId int
// 	PreviousOrganizationTcNo varchar(254)
// 	RollNumber varchar(254)
// 	SubjectCombinationId int
// 	FeeTemplateId int
// 	MergeAddonAndOrgFees varchar(254)
// 	AdmissionCategoryId int
// 	RollNumberAcademicYear varchar(254)


// For  MakeAdmission API 
router.post('/MakeAdmissionCreate', function (req, res) {
    console.log(req.body);
    let Id = req.body.Id;
    let Name = req.body.Name;
    let InstitutionId = req.body.InstitutionId;
    let StudentCode = req.body.StudentCode;
    let ApplicationNumber = req.body.ApplicationNumber;
    // let IncomeAccountId = req.body.IncomeAccountId;
    // let Description = req.body.Description;
    // let FeesAccountId = req.body.FeesAccountId;
    //let PaymentMethodId = req.body.PaymentMethodId;
    //let Amount = req.body.Amount;
    //let Status = req.body.Status;
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;
    let DateOfBirth = req.body.DateOfBirth;
    let AdmissionNo = req.body.AdmissionNo;
    let AdmissionDate = req.body.AdmissionDate;
    let Gender = req.body.Gender;
    // let GenderStr = req.body.GenderStr;
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
    // let Class = req.body.Class;
    // let AcademicYear = req.body.AcademicYear;
    // let IsAdmissionPending = req.body.IsAdmissionPending;
    // let PreviousOrganization = req.body.PreviousOrganization;
    // let AddOnFacilityIds=req.body.AddOnFacilityIds;
    // let ApplicationFeesAcademicYearId=req.body.ApplicationFeesAcademicYearId;
    let EmailId = req.body.EmailId;
    let Password = req.body.Password;
    let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
    let AcademicYearId = req.body.AcademicYearId;
    let ClassId = req.body.ClassId;
    let FatherName = req.body.FatherName;
    let MotherName = req.body.MotherName;
    let FatherEducation = req.body.FatherEducation;
    let MotherEducation = req.body.MotherEducation;
    let FatherOccupation = req.body.FatherOccupation;
    let MotherOccupation = req.body.MotherOccupation;
    let AnnualIncome = req.body.AnnualIncome;
    let ParentPhoneNumber = req.body.ParentPhoneNumber;
    let ParentAlternatePhoneNumber = req.body.ParentAlternatePhoneNumber;
    let ParentEmailId = req.body.ParentEmailId;
    let PreviousOrganization = req.body.PreviousOrganization;
    let PlaceofBirth = req.body.PlaceofBirth;
    let AadhaarNumber = req.body.AadhaarNumber;
    let Nationality = req.body.Nationality;
    let MotherTongue = req.body.MotherTongue;
    let StudentQuotaId = req.body.StudentQuotaId;
    let PreviousOrganizationTcNo = req.body.PreviousOrganizationTcNo;
    let RollNumber = req.body.RollNumber;
    let SubjectCombinationId = req.body.SubjectCombinationId;
    let FeeTemplateId = req.body.FeeTemplateId;
    let MergeAddonAndOrgFees = req.body.MergeAddonAndOrgFees;
    let AdmissionCategoryId = req.body.AdmissionCategoryId;
    let RollNumberAcademicYear = req.body.RollNumberAcademicYear;
    let AddOnFacilityIds = req.body.AddOnFacilityIds;
    let StudentCustomFieldsArr = req.body.StudentCustomFieldsArr;
    let StudentId_Output;
    let errorInForLop = false;


    try {
        if (Id == "") throw "Id is empty";
        if (Name == "") throw "Name is empty";
        if (InstitutionId == "") throw "InstitutionId is empty";
        if (StudentCode == "") throw "StudentCode is empty";
        if (ApplicationNumber == "") throw "ApplicationNumber is empty";
        // if (IncomeAccountId == "") throw "IncomeAccountId is empty";
        // if (Description == "") throw "Description is empty";
        // if (FeesAccountId == "") throw "FeesAccountId is empty";
        // if (PaymentMethodId == "") throw "PaymentMethodId is empty";
        // if (Amount == "") throw "Amount is empty";
        // if (Status == "") throw "Status is empty";
        if (FirstName == "") throw "FirstName is empty";
        if (LastName == "") throw "LastName is empty";
        if (DateOfBirth == "") throw "DateOfBirth is empty";
        if (AdmissionNo == "") throw "AdmissionNo is empty";
        if (AdmissionDate == "") throw "AdmissionDate is empty";
        if (Gender == "") throw "Gender is empty";
        // if (GenderStr == "") throw "GenderStr is empty";
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
        // if (Class == "") throw "Class is empty";
        // if (AcademicYear == "") throw "AcademicYear is empty";
        // if (IsAdmissionPending == "") throw "IsAdmissionPending is empty";
        // if (PreviousOrganization == "") throw "PreviousOrganization is emptyp";
        // if (AddOnFacilityIds == "") throw "AddOnFacilityIds is empty";
        // if (ApplicationFeesAcademicYearId == "") throw "ApplicationFeesAcademicYearId is empty";
        if (EmailId == "") throw "EmailId is empty";
        if (Password == "") throw "Password is empty";
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
        if (ParentPhoneNumber == "") throw "ParentPhoneNumber is empty";
        if (ParentAlternatePhoneNumber == "") throw "ParentAlternatePhoneNumber is empty";
        if (ParentEmailId == "") throw "ParentEmailId is empty";
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
            request.input('Password', sql.VarChar, Password);
            request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
            request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
            request.input('ClassId', sql.Int, parseInt(ClassId, 10));
            request.input('FatherName', sql.VarChar, FatherName);
            request.input('MotherName', sql.VarChar, MotherName);
            request.input('FatherEducation', sql.VarChar, FatherEducation);
            request.input('MotherEducation', sql.VarChar, MotherEducation);
            request.input('FatherOccupation', sql.VarChar, FatherOccupation);
            request.input('MotherOccupation', sql.VarChar, MotherOccupation);
            request.input('AnnualIncome', sql.Int, parseInt(AnnualIncome, 10));
            request.input('ParentPhoneNumber', sql.VarChar, ParentPhoneNumber);
            request.input('ParentAlternatePhoneNumber', sql.VarChar, ParentAlternatePhoneNumber);
            request.input('ParentEmailId', sql.VarChar, ParentEmailId);
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
            request.input('RollNumberAcademicYear', sql.VarChar, RollNumberAcademicYear);
            request.input('AddOnFacilityIds', sql.VarChar, AddOnFacilityIds);
            request.output('StudentId', sql.Int);

            request.execute("MakeAdmissionCreate").then(function (recordsets) {

                //console.log(recordsets);
                if (recordsets.output.StudentId == 0) {
                    //result false
                    console.log(err);
                    res.send({
                        success: false,
                        message: err.message
                    });
                } else {
                    StudentId_Output = recordsets.output.StudentId;
                    console.log('Make Admission Output ===>');
                    console.log(StudentId_Output);
                    //Set Student Custom Fields here.
                    ////
                    if (StudentCustomFieldsArr != "" && StudentCustomFieldsArr.length > 0) {
                        var dbConn2 = new sql.ConnectionPool(localconfig);
                        dbConn2.connect().then(function () {
                            StudentCustomFieldsArr.forEach(function (field) {
                                console.log('field ===>');
                                console.log(field);
                                var request2 = new sql.Request(dbConn2);
                                request2.input('Id', sql.Int, parseInt(field.Id, 10));
                                request2.input('CustomFieldId', sql.Int, parseInt(field.CustomFieldId, 10));
                                request2.input('CustomFieldValue', sql.VarChar, field.CustomFieldValue);
                                request2.input('StudentId', sql.Int, parseInt(StudentId_Output, 10));
                                request2.execute('StudentCustomFieldMapping_CreateOrUpdate').then(function (results) {
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
                    }
                    //\\
                }
                if (errorInForLop === true) {
                    res.send({
                        success: false,
                        message: "Error while updating Admitting the Student."
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success"
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


//  Id int
// // 	StudentName varchar(254)
// // 	InstitutionId int
// // 	ApplicationNumber varchar(254)
// // 	ApplicationDate varchar(254)
// // 	AcademicYearId int
// // 	IncomeAccountId int
// // 	Description varchar(254)
// // 	FeesAccountId int
// // 	PaymentMethodId int
// // 	Amount varchar(254)
// // 	Status varchar(254)
// // 	StudentCode varchar(254)
// // 	FirstName varchar(254)
// // 	LastName varchar(254)
// // 	FatherName varchar(254)
// // 	MotherName varchar(254)
// // 	DateOfBirth varchar(254)
// // 	AdmissionNo varchar(254)
// // 	AdmissionDate varchar(254)
// // 	Gender varchar(254)
// // 	GenderStr varchar(254)
// // 	ReligionId int
// // 	CasteId int
// // 	SubCasteId int
// // 	ReservationCategoryId int
// // 	MediumId int
// // 	PresentAddress varchar(254)
// // 	PermanentAddress varchar(254)
// // 	PhoneNumber varchar(254)
// // 	ParentId int
// // 	BloodGroup varchar(254)
// // 	PhysicallyChallenged varchar(254)
// // 	PatternId int
// // 	CurrentClassSectionMediumId varchar(254)
// // 	Active varchar(254)
// // 	UserName varchar(254)
// // 	AlternativePhoneNumber varchar(254)
// // 	ClassId int
// // 	Class varchar(254)
// // 	AcademicYear varchar(254)
// // 	IsAdmissionPending bit
// // 	PreviousOrganization varchar(254)
// // 	AddOnFacilityIds varchar(254)
// // 	ApplicationFeesAcademicYearId int
// // 	EmailId varchar(254)
// // 	FatherEducation varchar(254)
// // 	MotherEducation varchar(254)
// // 	FatherOccupation varchar(254)
// // 	MotherOccupation varchar(254)
// // 	AnnualIncome int
// // 	ParentPhoneNumber varchar(254)
// // 	ParentAlternatePhoneNumber varchar(254)
// // 	ParentEmailId varchar(254)
// // 	PlaceofBirth varchar(254)
// // 	AadhaarNumber varchar(254)
// // 	Nationality varchar(254)
// // 	MotherTongue varchar(254)
// // 	StudentQuotaId int
// // 	PreviousOrganizationTcNo varchar(254)
// // 	RollNumber varchar(254)
// // 	SubjectCombinationId int
// // 	FeeTemplateId int
// // 	MergeAddonAndOrgFees varchar(254)
// // 	AdmissionCategoryId int
// // 	RollNumberAcademicYear varchar(254)


// // For  MakeAdmission API 
//     router.post('/StudentCreate', function (req, res) {
//     let Id = req.body.Id;
//     let Name = req.body.Name;
//     let InstitutionId = req.body.InstitutionId;
//     let StudentCode = req.body.StudentCode;
//     let ApplicationNumber = req.body.ApplicationNumber;
//     let FirstName = req.body.FirstName;
//     let LastName = req.body.LastName;
//     let DateOfBirth = req.body.DateOfBirth;
//     let AdmissionNo = req.body.AdmissionNo;
//     let AdmissionDate = req.body.AdmissionDate;
//     let Gender = req.body.Gender;
//     let ReligionId = req.body.ReligionId;
//     let CasteId = req.body.CasteId;
//     let SubCasteId = req.body.SubCasteId;
//     let ReservationCategoryId = req.body.ReservationCategoryId;
//     let MediumId = req.body.MediumId;
//     let PresentAddress = req.body.PresentAddress;
//     let PermanentAddress = req.body.PermanentAddress;
//     let PhoneNumber = req.body.PhoneNumber;
//     let ParentId = req.body.ParentId;
//     let BloodGroup = req.body.BloodGroup;
//     let PhysicallyChallenged = req.body.PhysicallyChallenged;
//     let PatternId = req.body.PatternId;
//     let CurrentClassSectionMediumId = req.body.CurrentClassSectionMediumId;
//     let Active = req.body.Active;
//     let UserName = req.body.UserName;
//     let AlternativePhoneNumber = req.body.AlternativePhoneNumber;
//     let AcademicYearId = req.body.AcademicYearId;
//     let ClassId = req.body.ClassId;
//     let PreviousOrganization = req.body.PreviousOrganization;
//     let EmailId=req.body.EmailId;
//     let PlaceofBirth=req.body.PlaceofBirth;
//     let AadhaarNumber=req.body.AadhaarNumber;
//     let Nationality=req.body.Nationality;
//     let MotherTongue=req.body.MotherTongue;
//     let StudentQuotaId=req.body.StudentQuotaId;
//     let PreviousOrganizationTcNo=req.body.PreviousOrganizationTcNo;
//     let RollNumber=req.body.RollNumber;
//     let SubjectCombinationId=req.body.SubjectCombinationId;
//     let FeeTemplateId=req.body.FeeTemplateId;
//     let MergeAddonAndOrgFees=req.body.MergeAddonAndOrgFees;
//     let AdmissionCategoryId=req.body.AdmissionCategoryId;
//     let RollNumberAcademicYear=req.body.RollNumberAcademicYear;

//     try {
//         if (Id == "") throw "Id is empty";
//         if (Name == "") throw "Name is empty";
//         if (InstitutionId == "") throw "InstitutionId is empty";
//         if (StudentCode == "") throw "StudentCode is empty";
//         if (ApplicationNumber == "") throw "ApplicationNumber is empty";
//         if (FirstName == "") throw "FirstName is empty";
//         if (LastName == "") throw "LastName is empty";
//         if (DateOfBirth == "") throw "DateOfBirth is empty";
//         if (AdmissionNo == "") throw "AdmissionNo is empty";
//         if (AdmissionDate == "") throw "AdmissionDate is empty";
//         if (Gender == "") throw "Gender is empty";
//         if (ReligionId == "") throw "ReligionId is empty";
//         if (CasteId == "") throw "CasteId is empty";
//         if (SubCasteId == "") throw "SubCasteId is empty";
//         if (ReservationCategoryId == "") throw "ReservationCategoryId is empty";
//         if (MediumId == "") throw "MediumId is empty";
//         if (PresentAddress == "") throw "PresentAddress is empty";
//         if (PermanentAddress == "") throw "PermanentAddress is empty";
//         if (PhoneNumber == "") throw "PhoneNumber is empty";
//         if (ParentId == "") throw "ParentId is empty";
//         if (BloodGroup == "") throw "BloodGroup is empty";
//         if (PhysicallyChallenged == "") throw "PhysicallyChallenged is empty";
//         if (PatternId == "") throw "PatternId is empty";
//         if (CurrentClassSectionMediumId == "") throw "CurrentClassSectionMediumId is empty";
//         if (Active == "") throw "Active is empty";
//         if (UserName == "") throw "UserName is empty";
//         if (AlternativePhoneNumber == "") throw "AlternativePhoneNumber is empty";
//         if (AcademicYearId == "") throw "AcademicYearId is empty";
//         if (ClassId == "") throw "ClassId is empty";
//         if (PreviousOrganization == "") throw "PreviousOrganization is emptyp";
//         if (EmailId == "") throw "EmailId is empty";
//         if (PlaceofBirth == "") throw "PlaceofBirth is empty";
//         if (AadhaarNumber == "") throw "AadhaarNumber is empty";
//         if (Nationality == "") throw "Nationality is empty";
//         if (MotherTongue == "") throw "MotherTongue is empty";
//         if (StudentQuotaId == "") throw "StudentQuotaId is empty";
//         if (PreviousOrganizationTcNo == "") throw "PreviousOrganizationTcNo is empty";
//         if (RollNumber == "") throw "RollNumber is empty";
//         if (SubjectCombinationId == "") throw "SubjectCombinationId is empty";
//         if (FeeTemplateId == "") throw "FeeTemplateId is empty";
//         if (MergeAddonAndOrgFees == "") throw "MergeAddonAndOrgFees is empty";
//         if (AdmissionCategoryId == "") throw "AdmissionCategoryId is empty";
//         if (RollNumberAcademicYear == "") throw "RollNumberAcademicYear is empty";


//         var dbConn = new sql.ConnectionPool(localconfig);
//         dbConn.connect().then(function () {
//             var request = new sql.Request(dbConn);
//             request.input('Id', sql.Int, parseInt(Id, 10));
//             request.input('Name', sql.VarChar, Name);
//             request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
//             request.input('StudentCode', sql.VarChar, StudentCode);
//             request.input('ApplicationNumber', sql.VarChar, ApplicationNumber);
//             request.input('FirstName', sql.VarChar, FirstName);
//             request.input('LastName', sql.VarChar, LastName);
//             request.input('DateOfBirth', sql.VarChar, DateOfBirth);
//             request.input('AdmissionNo', sql.VarChar, AdmissionNo);
//             request.input('AdmissionDate', sql.VarChar, AdmissionDate);
//             request.input('Gender', sql.VarChar, Gender);
//             request.input('ReligionId', sql.Int, parseInt(ReligionId, 10));
//             request.input('CasteId', sql.Int, parseInt(CasteId, 10));
//             request.input('SubCasteId', sql.Int, parseInt(SubCasteId, 10));
//             request.input('ReservationCategoryId', sql.Int, parseInt(ReservationCategoryId, 10));
//             request.input('MediumId', sql.Int, parseInt(MediumId, 10));
//             request.input('PresentAddress', sql.VarChar, PresentAddress);
//             request.input('PermanentAddress', sql.VarChar, PermanentAddress);
//             request.input('PhoneNumber', sql.VarChar, PhoneNumber);
//             request.input('ParentId', sql.Int, parseInt(ParentId, 10));
//             request.input('BloodGroup', sql.VarChar, BloodGroup);
//             request.input('PhysicallyChallenged', sql.VarChar, PhysicallyChallenged);
//             request.input('PatternId', sql.Int, parseInt(PatternId, 10));
//             request.input('CurrentClassSectionMediumId', sql.Int, parseInt(CurrentClassSectionMediumId, 10));
//             request.input('Active', sql.VarChar, Active);
//             request.input('UserName', sql.VarChar, UserName);
//             request.input('AlternativePhoneNumber', sql.VarChar, AlternativePhoneNumber);
//             request.input('AcademicYearId', sql.Int, parseInt(AcademicYearId, 10));
//             request.input('ClassId', sql.Int, parseInt(ClassId, 10));
//             request.input('PreviousOrganization', sql.VarChar, PreviousOrganization);
//             request.input('EmailId', sql.VarChar, EmailId);
//             request.input('PlaceofBirth', sql.VarChar, PlaceofBirth);
//             request.input('AadhaarNumber', sql.VarChar, AadhaarNumber);
//             request.input('Nationality', sql.VarChar, Nationality);
//             request.input('MotherTongue', sql.VarChar, MotherTongue);
//             request.input('StudentQuotaId', sql.Int, parseInt(StudentQuotaId, 10));
//             request.input('PreviousOrganizationTcNo', sql.VarChar, PreviousOrganizationTcNo);
//             request.input('RollNumber', sql.VarChar, RollNumber);
//             request.input('SubjectCombinationId', sql.Int, parseInt(SubjectCombinationId, 10));
//             request.input('FeeTemplateId',sql.Int, parseInt(FeeTemplateId, 10));
//             request.input('MergeAddonAndOrgFees', sql.VarChar, MergeAddonAndOrgFees);
//             request.input('AdmissionCategoryId', sql.Int, parseInt(AdmissionCategoryId, 10));
//             request.input('RollNumberAcademicYear', sql.VarChar, RollNumberAcademicYear);


//             request.execute("Student_CreateOrUpdate").then(function (results) {
//                 console.log(results);

//                 if (results.returnValue != 0) {
//                     res.send({
//                         success: false,
//                         message: "Error while Admitting the Student.",
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

// API for ApplicationFormSelectAllByInstitutionId
router.post('/getApplicationFormInstitutionId', function (req, res) {
    let InstitutionId = req.body.InstitutionId;
    try {
        if (InstitutionId == "") throw "InstitutionId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.execute("ApplicationFormSelectAllByInstitutionId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "ApplicationForm SelectAll By InstitutionId details not found"
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

// API for StudentSelectAllByInstitutionId

router.post('/getStudentInstitutionId', function (req, res) {
    let InstitutionId = req.body.InstitutionId;
    try {
        if (InstitutionId == "") throw "InstitutionId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.execute("StudentSelectAllByInstitutionId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Student SelectAll By InstitutionId details not found"
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