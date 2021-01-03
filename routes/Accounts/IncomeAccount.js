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

router.post('/getIncomeAccounts', function (req, res) {

    try {
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.execute("IncomeAccount_selectAll").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "IncomeAccount details not found"
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
router.post('/getIncomeAccount', function (req, res) {
    let Id = req.body.Id;
    try {
        if (Id == "") throw "Id is empty";
        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.execute("IncomeAccount_selectById").then(function (results) {
                console.log(results);

                if (results.recordset === [] || results.recordset.length === 0 || results.recordset === undefined
                    || results.recordset === null) {
                    res.send({
                        success: false,
                        message: "IncomeAccount details not found"
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
    "AccountName":"",
    "AccountNumber":"",
    "IFSCCode":"",
    "NickName":"",
    "Bank":"",
    "City":"",
    "State":"",
    "Country":"",
    "UpiId":"",
    "InstitutionId":""
}
*/
router.post('/setIncomeAccount', function (req, res) {
    let Id = req.body.Id;
    let AccountName = req.body.AccountName;
    let AccountNumber = req.body.AccountNumber;
    let IFSCCode = req.body.IFSCCode;
    let NickName = req.body.NickName;
    let Bank = req.body.Bank;
    let City = req.body.City;
    let State = req.body.State;
    let Country = req.body.Country;
    let UpiId = req.body.UpiId;
    try {
        if (Id == "") throw "Id is empty";
        if (AccountName == "") throw "AccountName is empty";
        if (AccountNumber == "") throw "AccountNumber is empty";
        if (IFSCCode == "") throw "IFSCCode is empty";
        if (NickName == "") throw "NickName is empty";
        if (Bank == "") throw "Bank is empty";
        if (City == "") throw "City is empty";
        //if (State == "") throw "State is empty";
        //if (Country == "") throw "Country is empty";
        //if (UpiId == "") throw "UpiId is empty";
        if (InstitutionId == "") throw "InstitutionId is empty";

        var dbConn = new sql.ConnectionPool(localconfig);
        dbConn.connect().then(function () {
            var request = new sql.Request(dbConn);
            request.input('Id', sql.Int, parseInt(Id, 10));
            request.input('AccountName', sql.VarChar, AccountName);
            request.input('AccountNumber', sql.VarChar, AccountNumber);
            request.input('IFSCCode', sql.VarChar, IFSCCode);
            request.input('NickName', sql.VarChar, NickName);
            request.input('Bank', sql.VarChar, Bank);
            request.input('City', sql.VarChar, City);
            request.input('State', sql.VarChar, State);
            request.input('Country', sql.VarChar, Country);
            request.input('UpiId', sql.VarChar, UpiId);
            request.input('InstitutionId', sql.Int, parseInt(InstitutionId, 10));


            request.execute("IncomeAccount_CreateorUpate").then(function (results) {
                console.log(results);

                if (results.returnValue != 0) {
                    res.send({
                        success: false,
                        message: "Error while updating IncomeAccount.",
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