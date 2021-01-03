var md5 = require("md5");
var moment = require("moment");
const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");

var sql = require("mssql");
const config = require("../../config");
var debug = require("debug")("http");

let API_KEY = "83471As1KlQvfy5540eb14";
let SCHOOL_SENDER_ID = "SIMPFO";
let ROUTE_NO = "4";

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
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "secret", function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Token Expired",
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
      message: "No token provided.",
    });
  }
});

router.post("/getBulkSMS", function (req, res) {
  try {
    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .execute("BulkSms_selectAll")
          .then(function (results) {
            console.log(results);

            if (
              results.recordset === [] ||
              results.recordset.length === 0 ||
              results.recordset === undefined ||
              results.recordset === null
            ) {
              res.send({
                success: false,
                message: "BulkSms details not found",
              });
            } else {
              res.send({
                success: true,
                message: "success",
                data: results.recordsets,
              });
            }
            dbConn.close();
          })
          .catch(function (err) {
            dbConn.close();
            console.log(err);
            res.send({
              success: false,
              message: err.message,
            });
          });
      })
      .catch(function (err) {
        console.log(err);
        res.send({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// {
// 	"Id":"1"
// }
router.post("/getBulkSms", function (req, res) {
  let Id = req.body.Id;
  try {
    if (Id == "") throw "Id is empty";
    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("Id", sql.Int, parseInt(Id, 10));
        request
          .execute("BulkSms_selectById")
          .then(function (results) {
            console.log(results);

            if (
              results.recordset === [] ||
              results.recordset.length === 0 ||
              results.recordset === undefined ||
              results.recordset === null
            ) {
              res.send({
                success: false,
                message: "BulkSms details not found",
              });
            } else {
              res.send({
                success: true,
                message: "success",
                data: results.recordsets,
              });
            }
            dbConn.close();
          })
          .catch(function (err) {
            dbConn.close();
            console.log(err);
            res.send({
              success: false,
              message: err.message,
            });
          });
      })
      .catch(function (err) {
        console.log(err);
        res.send({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

/*
For new record, send Id as -1 else to update existing record, send Id with existing value.
{
    "Id":" ",
  "UserType":" ",
  "InstitutionId":" ",
  "FacilityId":" ",
  "AcademicYearId":" ",
  "ClssSectionMediumIds":" ",
  "Message":" ",
  "SmsTemplateId":" ",
  "ExcludeSmsWithApp":" ",
  "SendPushNotification":" ",
}
*/
router.post("/setBulkSms", function (req, res) {
  let Id = req.body.Id;
  let UserType = req.body.UserType;
  let InstitutionId = req.body.InstitutionId;
  let FacilityId = req.body.FacilityId;
  let AcademicYearId = req.body.AcademicYearId;
  let ClssSectionMediumIds = req.body.ClssSectionMediumIds;
  let Message = req.body.Message;
  let ExcludeSmsWithApp = req.body.ExcludeSmsWithApp;
  let SmsTemplateId = req.body.SmsTemplateId;
  let SendPushNotification = req.body.SendPushNotification;

  try {
    if (Id == "") throw "Id is empty";
    if (UserType == "") throw "UserType is empty";
    if (InstitutionId == "") throw "InstitutionId is empty";
    if (FacilityId == "") throw "FacilityId is empty";
    if (AcademicYearId == "") throw "AcademicYearId is empty";
    if (ClssSectionMediumIds == "") throw "ClssSectionMediumIds is empty";
    if (Message == "") throw "Message is empty";
    //if (ExcludeSmsWithApp == "") throw "ExcludeSmsWithApp is empty";
    if (SmsTemplateId == "") throw "SmsTemplateId is empty";
    //if (SendPushNotification == "") throw "SendPushNotification is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("Id", sql.Int, parseInt(Id, 10));
        request.input("UserType", sql.VarChar, UserType);
        request.input("InstitutionId", sql.Int, parseInt(InstitutionId, 10));
        request.input("FacilityId", sql.Int, parseInt(FacilityId, 10));
        request.input("AcademicYearId", sql.Int, parseInt(AcademicYearId, 10));
        request.input(
          "ClssSectionMediumIds",
          sql.Int,
          parseInt(ClssSectionMediumIds, 10)
        );
        request.input("Message", sql.VarChar, Message);
        request.input("ExcludeSmsWithApp", sql.VarChar, ExcludeSmsWithApp);
        request.input("SmsTemplateId", sql.Int, parseInt(SmsTemplateId, 10));
        request.input(
          "SendPushNotification",
          sql.VarChar,
          SendPushNotification
        );

        request
          .execute("BulkSms_CreateOrUpdate")
          .then(function (results) {
            if (results.returnValue != 0) {
              res.send({
                success: false,
                message: "Error while updating BulkSms.",
                results: results,
              });
            } else {
              let PhoneNumbers = [];
              try {
                for (var i = 0; i < results.recordsets.length; i++) {
                  PhoneNumbers.push(results.recordsets[0][i].contactNumbers);
                }

                let Simpfo_msg91 = require("msg91")(
                  API_KEY,
                  SCHOOL_SENDER_ID,
                  ROUTE_NO
                );
                Simpfo_msg91.send(PhoneNumbers, Message, function (
                  err,
                  response
                ) {
                  console.log(err);
                  console.log(response);
                  res.send({
                    success: true,
                    message: response.message,
                  });
                });
              } catch (error) {
                console.log(error);
                res.send({
                  success: false,
                  message: error,
                });
              }
            }
            dbConn.close();
          })
          .catch(function (err) {
            dbConn.close();
            console.log(err);
            res.send({
              success: false,
              message: err.message,
            });
          });
      })
      .catch(function (err) {
        res.send({
          success: false,
          message: err.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error,
    });
  }
});

// router.post("/delBulkSms", function (req, res) {
//   let Id = req.body.Id;

//   try {
//     if (Id == "") throw "Id is empty";

//     var dbConn = new sql.ConnectionPool(localconfig);
//     dbConn
//       .connect()
//       .then(function () {
//         var request = new sql.Request(dbConn);
//         request.input("Id", sql.Int, parseInt(Id, 10));

//         request
//           .execute("BulkSms_delete")
//           .then(function (results) {
//             console.log(results);

//             if (results.returnValue != 0) {
//               res.send({
//                 success: false,
//                 message: "Error while Deleting BulkSms.",
//                 results: results,
//               });
//             } else {
//               res.send({
//                 success: true,
//                 message: "success",
//                 data: results.recordsets,
//               });
//             }
//             dbConn.close();
//           })
//           .catch(function (err) {
//             dbConn.close();
//             console.log(err);
//             res.send({
//               success: false,
//               message: err.message,
//             });
//           });
//       })
//       .catch(function (err) {
//         res.send({
//           success: false,
//           message: err.message,
//         });
//       });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       success: false,
//       message: error,
//     });
//   }
//});
