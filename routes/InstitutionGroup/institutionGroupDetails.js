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


/* get institutionGroupDetails */
router.post('/getinstitutiongroup', function (req, res) {
    let institutionGroupId = req.body.Id;

    try {
        if (institutionGroupId == "") throw "InstitutionGroupId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(institutionGroupId, 10));
            request.execute("InstitutionGroupDetails").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined ||
                    results.recordset === null) {
                    res.send({
                        success: false,
                        message: "institution group id: " + req.body.Id + ", Institution group not found"
                    });
                } else {
                    res.send({
                        success: true,
                        message: "success",
                        //data: results.recordsets
                        institutionGroup: results.recordsets[0],
                        institutions: results.recordsets[1]
                    });
                }
                dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                console.log(err);
                res.send({
                    success: false,
                    message: err.message + "institution group id: " + req.body.Id
                });
            });
        }).catch(function (err) {
            console.log(err);
        });

    } catch (error) {
        console.log(error);
    }
});

/* set institutionGroupDetails */
/*
Postman test data
For new school, send Id as -1 else to update existing record, send the correct Id value.
----------------------------
{
"Id":"1"
"Name":"Test School",
"Address":"Test address",
"City":"Bengaluru South",
"District":"Bengaluru Urban",
"State":"Ka",
"Country":"IN",
"Pincode":"560",
"Phone1":"234",
"Phone2":"234",
"Fax":"324",
"EmailId":"jaya@jalk.com",
"Logo":"adsf",
"WebsiteUrl":"www.simpfo.in",
"FacebookUrl":"fb",
"TwitterUrl":"twitter",
"InstagramUrl":"insta",
"IsReadOnlyMode":"0"
}
----------------------------
*/
router.post('/setinstitutiongroup', function (req, res) {
    let Id = req.body.Id;
    let Name = req.body.Name;
    let Address = req.body.Address;
    let City = req.body.City;
    let District = req.body.District;
    let State = req.body.State;
    let Country = req.body.Country;
    let Pincode = req.body.Pincode;
    let Phone1 = req.body.Phone1;
    let Phone2 = req.body.Phone2;
    let Fax = req.body.Fax;
    let EmailId = req.body.EmailId;
    let Logo = req.body.Logo;
    let WebsiteUrl = req.body.WebsiteUrl;
    let FacebookUrl = req.body.FacebookUrl;
    let TwitterUrl = req.body.TwitterUrl;
    let InstagramUrl = req.body.InstagramUrl;
    let IsReadOnlyMode = req.body.IsReadOnlyMode;

    try {
        if (Name == "") throw "Name is empty";
        if (Address == "") throw "Address is empty";
        if (City == "") throw "City is empty";
        if (District == "") throw "District is empty";
        if (State == "") throw "State is empty";
        if (Country == "") throw "Country is empty";
        if (Pincode == "") throw "Pincode is empty";
        if (Phone1 == "") throw "Phone1 is empty";
        //if (Phone2 == "") throw "Phone2 is empty"; 
        //if (Fax == "") throw "Fax is empty"; 
        if (EmailId == "") throw "EmailId is empty";
        if (Logo == "") throw "Logo is empty";
        //if (WebsiteUrl == "") throw "WebsiteUrl is empty"; 
        //if (FacebookUrl == "") throw "FacebookUrl is empty"; 
        //if (TwitterUrl == "") throw "TwitterUrl is empty"; 
        //if (InstagramUrl == "") throw "InstagramUrl is empty"; 

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('Name', sql.VarChar, Name);
            request.input('Address', sql.VarChar, Address);
            request.input('City', sql.VarChar, City);
            request.input('District', sql.VarChar, District);
            request.input('State', sql.VarChar, State);
            request.input('Country', sql.VarChar, Country);
            request.input('Pincode', sql.VarChar, Pincode);
            request.input('Phone1', sql.VarChar, Phone1);
            request.input('Phone2', sql.VarChar, Phone2);
            request.input('Fax', sql.VarChar, Fax);
            request.input('EmailId', sql.VarChar, EmailId);
            request.input('Logo', sql.VarChar, Logo);
            request.input('WebsiteUrl', sql.VarChar, WebsiteUrl);
            request.input('FacebookUrl', sql.VarChar, FacebookUrl);
            request.input('TwitterUrl', sql.VarChar, TwitterUrl);
            request.input('InstagramUrl', sql.VarChar, InstagramUrl);
            request.input('IsReadOnlyMode', sql.VarChar, IsReadOnlyMode);
            request.execute("InstitutionGroupCreateOrUpdate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating Institution group.",
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

module.exports = router;

router.post('/InstitutionGroupImagePath', function (req, res) {
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

            request.execute("InstitutionGroup_UpdateImagePath").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating InstitutionGroup ImagePath.",
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