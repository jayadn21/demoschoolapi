var md5 = require("md5");
var moment = require("moment");
const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");

var sql = require("mssql");
const config = require("../../config");
var debug = require("debug")("http");

var localconfig = {
  server: config.sqlhostname,
  database: config.sqldatabase,
  user: config.sqlUsername,
  password: config.sqlPassword,
  port: config.sqlport,
  encrypt: config.encrypt,
};

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
        return res.json({ success: false, message: "Token Expired" });
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

/*
Sample Postman data:
{
  "UserLoginId":"9"
}
*/
/* get UserDefaultInstitution */
router.post("/getuserdefaultinstitution", function (req, res) {
  let UserLoginId = req.body.UserLoginId;

  try {
    if (UserLoginId == "") throw "UserLoginId is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("UserLoginId", sql.Int, parseInt(UserLoginId, 10));
        request
          .execute("UserDefaultInstitution")
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
                message: "Institution details for the user not found",
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

router.post("/getinstitutelockstatus", function (req, res) {
  let InstitutionId = req.body.InstituteId;

  try {
    if (InstitutionId == "") throw "Institution Id is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("InstitutionId", sql.Int, parseInt(InstitutionId, 10));
        request
          .execute("Institution_getLockStatus")
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
                message: "Institution status not found",
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

router.post("/setinstitutelockstatus", function (req, res) {
  let InstitutionId = req.body.InstituteId;
  let ReadMode = req.body.ReadMode;

  try {
    if (InstitutionId == "") throw "Institution Id is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("InstitutionId", sql.Int, parseInt(InstitutionId, 10));
        request.input("ReadMode", sql.Bit, ReadMode);
        request
          .execute("Institution_setLockStatus")
          .then(function (results) {
            console.log(results);

            if (results.returnValue != 0) {
              res.send({
                success: false,
                message: "Error while updating Institution read mode.",
                results: results,
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

router.post("/getinstitutionsmsRemaining", function (req, res) {
  try {
    if (UserLoginId == "") throw "UserLoginId is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request
          .execute("Institution_smsRemaining")
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
                message: "Institution details for the user not found",
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
Sample Postman data:
{
  "UserLoginId":"9"
}
*/
/* get UserDefaultInstitution */
router.post("/getInstitutionUserMappings", function (req, res) {
  let UserLoginId = req.body.UserLoginId;

  try {
    if (UserLoginId == "") throw "UserLoginId is empty";

    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("UserLoginId", sql.Int, parseInt(UserLoginId, 10));
        request
          .execute("InstitutionUserLoginSelectByLoginId")
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
                message: "Institution details for the user not found",
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

/* set institutionDetails */
/*
Postman test data
To create a new Institution, send "Id" value as -1 else 
if updating an existing institution, send the correct value for "Id"
----------------------------
{
"Id":"-1",
"InstitutionGroupId":"1",
"Name":"Test School",
"Address":"Test address",
"City":"Bengaluru South",
"District":"Bengaluru Urban",
"State":"Ka",
"Country":"IN",
"Pincode":"560",
"TeachingMedium":"English",
"Phone1":"234",
"Phone2":"234",
"EmailId":"jaya@jalk.com",
"Fax":"324",
"Logo":"adsf",
"DiseNumber":"1234"
}
----------------------------
*/
router.post("/setinstitution", function (req, res) {
  let Id = req.body.Id;
  let InstitutionGroupId = req.body.InstitutionGroupId;
  let Name = req.body.Name;
  let Address = req.body.Address;
  let City = req.body.City;
  let District = req.body.District;
  let State = req.body.State;
  let Country = req.body.Country;
  let Pincode = req.body.Pincode;
  let TeachingMedium = req.body.TeachingMedium;
  let Phone1 = req.body.Phone1;
  let Phone2 = req.body.Phone2;
  let EmailId = req.body.EmailId;
  let Fax = req.body.Fax;
  let Logo = req.body.Logo;
  let DiseNumber = req.body.DiseNumber;
  let IsReadOnlyMode = req.body.IsReadOnlyMode;

  try {
    if (Id == null || Id == "") throw "Id is empty";
    if (InstitutionGroupId == null || InstitutionGroupId == "")
      throw "InstitutionGroupId is empty";
    if (Name == "") throw "Name is empty";
    if (Address == "") throw "Address is empty";
    if (City == "") throw "City is empty";
    if (District == "") throw "District is empty";
    if (State == "") throw "State is empty";
    if (Country == "") throw "Country is empty";
    if (Pincode == "") throw "Pincode is empty";
    if (TeachingMedium == "") throw "TeachingMedium is empty";
    if (Phone1 == "") throw "Phone1 is empty";
    //if (Phone2 == "") throw "Phone2 is empty";
    if (EmailId == "") throw "EmailId is empty";
    //if (Fax == "") throw "Fax is empty";
    if (Logo == "") throw "Logo is empty";
    if (DiseNumber == "") throw "DiseNumber is empty";
    console.log("------------->");
    var dbConn = new sql.ConnectionPool(localconfig);
    dbConn
      .connect()
      .then(function () {
        var request = new sql.Request(dbConn);
        request.input("Id", parseInt(Id, 10));
        request.input(
          "InstitutionGroupId",
          sql.Int,
          parseInt(InstitutionGroupId, 10)
        );
        request.input("Name", sql.VarChar, Name);
        request.input("Address", sql.VarChar, Address);
        request.input("City", sql.VarChar, City);
        request.input("District", sql.VarChar, District);
        request.input("State", sql.VarChar, State);
        request.input("Country", sql.VarChar, Country);
        request.input("Pincode", sql.Int, parseInt(Pincode, 10));
        request.input("TeachingMedium", sql.VarChar, TeachingMedium);
        request.input("Phone1", sql.VarChar, Phone1);
        request.input("Phone2", sql.VarChar, Phone2);
        request.input("EmailId", sql.VarChar, EmailId);
        request.input("Fax", sql.VarChar, Fax);
        request.input("Logo", sql.VarChar, Logo);
        request.input("DiseNumber", sql.Int, parseInt(DiseNumber, 10));
        request.input("IsReadOnlyMode", sql.Int, parseInt(IsReadOnlyMode, 10));
        request
          .execute("InstitutionCreateOrUpdate")
          .then(function (results) {
            console.log(results);

            if (results.returnValue != 0) {
              res.send({
                success: false,
                message: "Error while updating Institution.",
                results: results,
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

module.exports = router;
