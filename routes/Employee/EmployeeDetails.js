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

router.post('/getemployees', function (req, res) {

    try {

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("EmployeeSelectAll").then(function (results) {
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
// 	"Id":"6"
// }
router.post('/getemployee', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("EmployeeSelectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Employee details for the user not found"
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
// 	"InstitutionBranchId":"1"
// }
router.post('/getemployeeCountByInstitutionBranchId', function (req, res) {
    console.log('req.body ===>');
    console.log(req.body);
    let InstitutionBranchId = req.body.InstitutionBranchId;
    try {
        if (InstitutionBranchId == "") throw "InstitutionBranchId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionBranchId', sql.Int, parseInt(InstitutionBranchId, 10));
            request.execute("Employee_employeeCountByInstitutionBranchId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Error while getting Employee count"
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
// 	"UserName":"joe"
// }
router.post('/getEmployeeByUserName', function (req, res) {
    let UserName = req.body.UserName;
    try {
        if (UserName == "") throw "UserName is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('UserName', sql.VarChar, UserName);
            request.execute("EmployeeSelectByUserName").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "Employee details for the user not found"
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
    "Id":"-1",
    "Name":"JC2",
    "PresentAddress":"HSR2",
    "EmpCode":"21",
    "BloodGroup":"B+",
    "PhoneNumber":"324324",
    "InstitutionBranchId":"1",
    "ImagePath":"null",
    "AadharNumber":"123",
    "PanNumber":"ai",
    "VoterId":"32",
    "EmailId":"jaya@jaya.com",
    "PermanentAddress":"Clk",
    "Gender":"Male",
    "JoiningDate":"1/1/19",
    "Qualification":"BE",
    "InDuty":"1",
    "TotalExperienceWhileJoining":"13",
    "RelievingDate":"",
    "IsMarried":"1",
    "UserName":"jc2",
    "AlternatePhoneNumber":"",
    "Nationality":"Indian",
    "MotherTounge":"Kannada",
    "DateOfBirth":"2019-07-08",
    "LoginAccess":"1",
    "Password":"jc2",
    "UserTypeId":"1",
    "DefaultInstitutionId":"1"
    }
*/
router.post('/setemployeedetails', function (req, res) {
    let Id = req.body.Id;
    let Name = req.body.Name;
    let PresentAddress = req.body.PresentAddress;
    let EmpCode = req.body.EmpCode;
    let BloodGroup = req.body.BloodGroup;
    let PhoneNumber = req.body.PhoneNumber;
    let InstitutionBranchIds = req.body.InstitutionBranchIds;
    let ImagePath = req.body.ImagePath;
    let AadharNumber = req.body.AadharNumber;
    let PanNumber = req.body.PanNumber;
    let VoterId = req.body.VoterId;
    let EmailId = req.body.EmailId;
    let PermanentAddress = req.body.PermanentAddress;
    let Gender = req.body.Gender;
    let JoiningDate = req.body.JoiningDate;
    let Qualification = req.body.Qualification;
    let InDuty = req.body.InDuty;
    let TotalExperienceWhileJoining = req.body.TotalExperienceWhileJoining;
    let RelievingDate = req.body.RelievingDate;
    let IsMarried = req.body.IsMarried;
    let UserName = req.body.UserName;
    let AlternatePhoneNumber = req.body.AlternatePhoneNumber;
    let Nationality = req.body.Nationality;
    let MotherTounge = req.body.MotherTounge;
    let DateOfBirth = req.body.DateOfBirth;
    let LoginAccess = req.body.LoginAccess;
    let Password = req.body.Password;
    let UserTypeId = req.body.UserTypeId;
    let UserProfileId = req.body.UserProfileId;
    let DefaultInstitutionId = req.body.DefaultInstitutionId;
    try {
        if (Id == "") throw "Id is empty";
        if (Name == "") throw "Name is empty";
        if (PresentAddress == "") throw "PresentAddress is empty";
        if (EmpCode == "") throw "EmpCode is empty";
        if (BloodGroup == "") throw "BloodGroup is empty";
        if (PhoneNumber == "") throw "PhoneNumber is empty";
        if (InstitutionBranchIds == "") throw "InstitutionBranchIds is empty";
        // if (ImagePath == "") throw "ImagePath is empty";
        if (AadharNumber == "") throw "AadharNumber is empty";
        if (PanNumber == "") throw "PanNumber is empty";
        // if (VoterId == "") throw "VoterId is empty";
        if (EmailId == "") throw "EmailId is empty";
        if (PermanentAddress == "") throw "PermanentAddress is empty";
        if (Gender == "") throw "Gender is empty";
        if (JoiningDate == "") throw "JoiningDate is empty";
        if (Qualification == "") throw "Qualification is empty";
        if (InDuty == "") throw "InDuty is empty";
        if (TotalExperienceWhileJoining == "") throw "TotalExperienceWhileJoining is empty";
        // if (RelievingDate == "") throw "RelievingDate is empty";
        if (IsMarried == "") throw "IsMarried is empty";
        if (UserName == "") throw "UserName is empty";
        // if (AlternatePhoneNumber == "") throw "AlternatePhoneNumber is empty";
        if (Nationality == "") throw "Nationality is empty";
        if (MotherTounge == "") throw "MotherTounge is empty";
        if (DateOfBirth == "") throw "DateOfBirth is empty";
        if (LoginAccess == "") throw "LoginAccess is empty";
        if (Password == "") throw "Password is empty";
        if (UserTypeId == "") throw "UserTypeId is empty";
        if (UserProfileId == "") throw "UserProfileId is empty";
        if (DefaultInstitutionId == "") throw "DefaultInstitutionId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('Name', sql.VarChar, Name);
            request.input('PresentAddress', sql.VarChar, PresentAddress);
            request.input('EmpCode', sql.VarChar, EmpCode);
            request.input('BloodGroup', sql.VarChar, BloodGroup);
            request.input('PhoneNumber', sql.VarChar, PhoneNumber);
            request.input('InstitutionBranchIds', sql.VarChar, InstitutionBranchIds);
            request.input('ImagePath', sql.VarChar, ImagePath);
            request.input('AadharNumber', sql.VarChar, AadharNumber);
            request.input('PanNumber', sql.VarChar, PanNumber);
            request.input('VoterId', sql.VarChar, VoterId);
            request.input('EmailId', sql.VarChar, EmailId);
            request.input('PermanentAddress', sql.VarChar, PermanentAddress);
            request.input('Gender', sql.VarChar, Gender);
            request.input('JoiningDate', sql.VarChar, JoiningDate);
            request.input('Qualification', sql.VarChar, Qualification);
            request.input('InDuty', sql.VarChar, InDuty);
            request.input('TotalExperienceWhileJoining', sql.VarChar, TotalExperienceWhileJoining);
            request.input('RelievingDate', sql.VarChar, RelievingDate);
            request.input('IsMarried', sql.VarChar, IsMarried);
            request.input('UserName', sql.VarChar, UserName);
            request.input('AlternatePhoneNumber', sql.VarChar, AlternatePhoneNumber);
            request.input('Nationality', sql.VarChar, Nationality);
            request.input('MotherTounge', sql.VarChar, MotherTounge);
            request.input('DateOfBirth', sql.VarChar, DateOfBirth);
            request.input('LoginAccess', sql.VarChar, LoginAccess);
            request.input('Password', sql.VarChar, Password);
            request.input('UserTypeId', sql.Int, parseInt(UserTypeId, 10));
            request.input('UserProfileId', sql.Int, parseInt(UserProfileId, 10));
            request.input('DefaultInstitutionId', sql.Int, parseInt(DefaultInstitutionId, 10));

            request.execute("EmployeeCreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Employee.",
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
    //Call the "EmployeeInstitutionBranchMapping_SetDefaultInstitution" here.
});

router.post('/SetDefaultInstitution', function (req, res) {
    let EmployeeId = req.body.EmployeeId;
    let InstitutionBranchId = req.body.DefaultInstitutionId;

    try {
        if (EmployeeId == "") throw "EmployeeId is empty";
        if (InstitutionBranchId == "") throw "InstitutionBranchId is empty";


        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('EmployeeId', parseInt(EmployeeId, 10));
            request.input('InstitutionBranchId', parseInt(InstitutionBranchId, 10));

            request.execute("EmployeeInstitutionBranchMapping_SetDefaultInstitution").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating DefaultInstitution.",
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
// router.post('/SetDefaultInstitution', function (req, res) {
//     let EmployeeId = req.body.EmployeeId;
//     let InstitutionBranchId = req.body.InstitutionBranchId;

//     try {
//         if (EmployeeId == "") throw "EmployeeId is empty";
//         if (InstitutionBranchId == "") throw "InstitutionBranchId is empty";

//         var dbConn = new sql.ConnectionPool(localconfig);
//         dbConn.connect().then(function () {
//             var request = new sql.Request(dbConn);
//             request.input('EmployeeId', sql.Int, parseInt(EmployeeId, 10));
//             request.input('InstitutionBranchId', sql.Int, parseInt(InstitutionBranchId, 10));
//             request.execute("EmployeeInstitutionBranchMapping_SetDefaultInstitution").then(function (results) {
//                 console.log(results);

//                 if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
//                     results.recordset === null) {
//                     res.send({
//                         success: false,
//                         message: "DefaultInstitution details for the user not found"
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
//             console.log(err);
//             res.send({
//                 success: false,
//                 message: err.message
//             });
//         });

//     } catch (error) {
//         console.log(error);
//         res.send({
//             success: false,
//             message: error.message
//         });
//     }
// });

/*
{
    "Name":"JC2",
    "PresentAddress":"HSR2",
    "UserName":"jc2"
    }
*/
router.post('/UpdateEmployeeProfile', function (req, res) {
    let Name = req.body.Name;
    let Address = req.body.PresentAddress;
    let UserName = req.body.UserName;
    try {
        if (Name == "") throw "Name is empty";
        if (Address == "") throw "Address is empty";
        if (UserName == "") throw "UserName is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Name', sql.VarChar, Name);
            request.input('Address', sql.VarChar, Address);
            request.input('UserName', sql.VarChar, UserName);


            request.execute("EmployeeProfileUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Employee Profile.",
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

router.post('/getEmployeeInstitutionId', function (req, res) {
    let InstitutionId = req.body.InstitutionId;
    try {
        if (InstitutionId == "") throw "InstitutionId is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));
            request.execute("EmployeeSelectAllByInstitutionId").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "EmployeeSelectAll By InstitutionId details not found"
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

router.post('/delEmployeedetail', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));

            request.execute("Employee_delete").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while deleting Employee Details.",
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
router.post('/UpdateEmployeeImagePath', function (req, res) {
    console.log(req.body);
    let Id = req.body.Id;
    let ImagePath = req.body.ImagePath;
    console.log(ImagePath);

    try {
        if (Id == "") throw "Id is empty";
        if (ImagePath == "") throw "ImagePath is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', parseInt(Id, 10));
            request.input('ImagePath', sql.VarChar, ImagePath);

            request.execute("Employee_UpdateImagePath").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Employees ImagePath.",
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