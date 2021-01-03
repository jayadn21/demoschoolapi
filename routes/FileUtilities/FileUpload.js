// var md5 = require("md5");
// var moment = require("moment");
// const express = require('express');
// const router = express.Router();
// var jwt = require("jsonwebtoken");
// var multer	=	require('multer');

// var sql = require('mssql');
// const config = require('../../config');
// var debug = require('debug')('http');

// var storage	=	multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.originalname);
//     }
//   });
//   var upload = multer({ storage : storage}).single('myfile');

// var localconfig = {
//     server: config.sqlhostname,
//     database: config.sqldatabase,
//     user: config.sqlUsername,
//     password: config.sqlPassword,
//     port: config.sqlport,
 //   encrypt: config.encrypt
// };

// module.exports = router;

// //verify token
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

// router.post('/uploadProfileImage', function (req, res) {
//     upload(req,res,function(err) {
// 		if(err) {
// 			return res.end("Error uploading file.");
// 		}
// 		res.end("File is uploaded successfully!");
// 	});
// });