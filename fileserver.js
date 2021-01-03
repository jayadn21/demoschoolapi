
/************************************************************For Upload functinality - Opening another port for upload alone********************************************************************************* */

//For Upload functinality - Opening another port for upload alone
// var mongoose = require('mongoose');
var connection = require('./connection');
var config = require('./config');
var uploadexpress = require('express');
const AWS = require("aws-sdk"); 
var multer = require('multer');
const fs = require("fs"); 
const path = require("path"); 
var uploadapp = uploadexpress();

// mongoose.Promise = require('bluebird');
// mongoose.connect(connection.connectionString, {
// 	keepAlive: true,
// 	reconnectTries: Number.MAX_VALUE,
// 	useNewUrlParser: true
// });
uploadapp.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

var JDstorage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './storage/');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
    // filename: function (req, file, cb) {
    //     cb(null, file.originalname);
    // }
});

var JDupload = multer({ //multer settings
    storage: JDstorage
}).single('file');

var JDFileName = JDstorage.filename;

function uploadtoS3Servers() {
	const distFolderPath = config.DestinationFolderPath;
	fs.readdir(distFolderPath, (err, files) => {

		if(!files || files.length === 0) {
		  console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
		  return;
		}
	  
		// for each file in the directory
		for (const fileName of files) {
	  
		  // get the full path of the file
		  const filePath = path.join(distFolderPath, fileName);
		  
		  // ignore if directory
		  if (fs.lstatSync(filePath).isDirectory()) {
			continue;
		  }
	  
		  AWS.config.update(
			{
			  accessKeyId: config.accesskeyId,
			  secretAccessKey: config.secretAccessKey,
			  region: config.region
			}
		  );
		  
		  var s3 = new AWS.S3();
		  
		  // read file contents
		  fs.readFile(filePath, (error, fileContent) => {
			// if unable to read file contents, throw exception
			if (error) { throw error; }
	  
			// upload file to S3
			s3.putObject({
			  Bucket: config.s3BucketName,
			  Key: fileName,
			  Body: fileContent
			}, (res) => {
			  console.log(`Successfully uploaded '${fileName}'!`);
			  // let device = '100';
			  let baseUrl = 'https://s3.ap-south-1.amazonaws.com/'+ config.s3BucketName + '/'
	  
			  var ext = fileName.substring(fileName.indexOf('.')+1); 
			  let fileType;
	  
			  if (ext == "png"|| ext == "JPEG" || ext == "jpeg" || ext == "jpg") {
				fileType = "Image";
			  } else {
				fileType = "Video";
			  }			  
				  
			  fs.unlink(filePath, (err) => {
				if (err) console.log(err);
				console.log(filePath + ' was deleted');
			  });
			});
	  
		  });
		}
	  });
	  
}
/** API path that will upload the files */
uploadapp.post('/upload', function (req, res) {
    //console.log('Request', req.files);
    //console.log(req.body.file);
    JDupload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }       
        console.log("hello")  ;
        uploadtoS3Servers();
        res.json({ error_code: 0, err_desc: null, filename: req.file });
        // res.json({ error_code: 0, err_desc: JDFileName, filename: JDFileName });
    });
});

uploadapp.listen('3003', function () {
    console.log('running on 3003 for upload functionality...');
});