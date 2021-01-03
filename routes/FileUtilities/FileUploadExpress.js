const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
var md5 = require("md5");
var moment = require("moment");
var jwt = require("jsonwebtoken");

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

// default options
router.use(fileUpload());

router.post('/upload', function (req, res) {
    console.log('Post method');
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let fileName = req.files.fileName;
    let folderName = req.body.folderName;
    let newFileName = req.body.newFileName;

    console.log('Current Path: ' + process.cwd());//__dirname);

    // Use the mv() method to place the file somewhere on your server
    fileName.mv(process.cwd() + '/uploads/' + folderName +'/'+ newFileName , function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});