var md5 = require("md5");
var moment = require("moment");
const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
var path = require('path');

// var localconfig = {
//     downloadBasePath: config.downloadBasePath
// };

module.exports = router;

//verify token
// router.use(function (req, res, next) {

//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];

//     // decode token
//     if (token) {

//         // verifies secret and checks exp
//         jwt.verify(token, "secret", function (err, decoded) {
//             if (err) {
//                 return res.json({ success: false, message: 'Token Expired' });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded; next();
//             }
//         });

//     } else {

//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });

// {
// 	"filePath":"1"
// }
router.get('/getFile', function (req, res) {
    let filePath = req.query.filePath;

    try {
        //res.sendFile(process.cwd() + '/public/uploads/' + filePath);
        // console.log('path ===>');
        // console.log(path.join(process.cwd(), filePath));
        res.sendFile(path.join(process.cwd(), filePath));

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: error.message
        });
    }
});
