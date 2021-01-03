const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const debug = require("debug")("myapp:server");
var cors = require("cors");

// environment variables
// process.env.NODE_ENV = 'demo';
// var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

//pm2 start server.js --node-args="--production --port=1337"

// switch (myArgs[0]) {
//   case 'demo':
//     console.log('Started the process in demo mode');
//     process.env.NODE_ENV = 'demo';
//     break;
//   default:
//     console.log('Started the process in production mode');
//     process.env.NODE_ENV = 'production';
// }

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*routes*/
const SchoolUser = require("./routes/auth/schooluserlogin");
const User = require("./routes/auth/userlogin");
const Userdetails = require("./routes/UserProfile/UserProfile");
const messageutils = require("./routes/message");
const InstitutionGroup = require("./routes/InstitutionGroup/institutionGroupDetails");
const UserProfile = require("./routes/UserProfile/UserProfile");
const Institution = require("./routes/Institution/InstitutionDetails");
const SystemSetup = require("./routes/Institution/SystemSetup");
const Employee = require("./routes/Employee/EmployeeDetails");
const ClassAndSection = require("./routes/Admin/ClassAndSection");
const Medium = require("./routes/Admin/Medium");
const ApplicationForm = require("./routes/Student/ApplicationForm");
const AcademicYear = require("./routes/Admin/AcademicYear");
const AccountingYear = require("./routes/Admin/AccountingYear");
const AddOnFacility = require("./routes/Admin/AddOnFacility");
const IncomeAccount = require("./routes/Accounts/IncomeAccount");
const FeesAccount = require("./routes/Accounts/FeesAccount");
const PaymentMethod = require("./routes/Accounts/PaymentMethod");
const FeesHeaders = require("./routes/Accounts/FeesHeaders");
const FeesTemplate = require("./routes/Accounts/FeesTemplate");
const ClassSectionMedium = require("./routes/Admin/ClassSectionMedium");
const Caste = require("./routes/Admin/Caste");
const Pattern = require("./routes/Admin/Pattern");
const Religion = require("./routes/Admin/Religion");
const ReservationCategory = require("./routes/Admin/ReservationCategory");
const SubCaste = require("./routes/Admin/SubCaste");
const ApplicationFormAddOnFacilityMapping = require("./routes/Admin/ApplicationFormAddOnFacilityMapping");
const FileUploadExpress = require("./routes/FileUtilities/FileUploadExpress");
const modules = require("./routes/Modules/modules");
const SubModules = require("./routes/Modules/SubModules");
const UserProfileModuleMapping = require("./routes/UserProfile/UserProfileModuleMapping");
const Student = require("./routes/Student/Student");
const Facility = require("./routes/Admin/Facility");
const FacilityFees = require("./routes/Accounts/FacilityFees");
const Assets = require("./routes/Accounts/Assets");
const Charts = require("./routes/Accounts/Charts");
const OpeningBalance = require("./routes/Accounts/OpeningBalance");
const ExpenseHeader = require("./routes/Accounts/ExpenseHeader");
const ExpenseAccount = require("./routes/Accounts/ExpenseAccount");
const Vendors = require("./routes/Accounts/Vendors");
const AttendanceSetup = require("./routes/Attendance/AttendanceSetup");
const CurrentClassSectionMedium = require("./routes/Admin/CurrentClassSectionMedium");
const AttendanceInsert = require("./routes/Attendance/AttendanceInsert");
const Diary = require("./routes/HomeWorkDiary/Diary");
const AttendanceSelect = require("./routes/Attendance/AttendanceSelect");
const ReportSetup = require("./routes/Attendance/ReportSetup");
const ViewReport = require("./routes/Attendance/ViewReport");
const PracticalClasses = require("./routes/Attendance/PracticalClasses");
const EventType = require("./routes/Admin/EventType");
const SubjectCombination = require("./routes/HomeWorkDiary/SubjectCombination");
const AdmissionCategory = require("./routes/Admin/AdmissionCategory");
const StudentQuota = require("./routes/Admin/StudentQuota");
const Assessment = require("./routes/GradeBook/Assessment");
const SubjectPage = require("./routes/GradeBook/SubjectPage");
const SubjectType = require("./routes/GradeBook/SubjectType");
const SubjectCombinationMapp = require("./routes/GradeBook/SubjectCombinationMapp");
const AssessmentHeads = require("./routes/GradeBook/AssessmentHeads");
const AssignCombination = require("./routes/GradeBook/AssignCombination");
const Remark = require("./routes/GradeBook/Remark");
const GradeSetup = require("./routes/GradeBook/GradeSetup");
const CustomField = require("./routes/Student/CustomField");
const StudentCatogeries = require("./routes/Student/StudentCatogeries");
const AdmissionTicket = require("./routes/Student/AdmissionTicket");
const IndirectAccount = require("./routes/Accounts/IndirectAccount");
const Expense = require("./routes/Accounts/Expense");
const FeesTemplateFeesAccountMapping = require("./routes/Accounts/FeesTemplateFeesAccountMapping");
const InternalTransaction = require("./routes/Accounts/InternalTransaction");
const Activities = require("./routes/Student/Activities");
const Events = require("./routes/Admin/Events");
const ViewAssessment = require("./routes/GradeBook/ViewAssessment");
const ClassSectionSubjectCombination = require("./routes/GradeBook/ClassSectionSubjectCombination");
const AssessmentClassSectionMappingMarks = require("./routes/GradeBook/AssessmentClassSectionMappingMarks");
const AssessmentClassSectionMappingStudentMarks = require("./routes/GradeBook/AssessmentClassSectionMappingStudentMarks");
const StudentByCurrentClassSectionMediumAcademicYear = require("./routes/GradeBook/StudentByCurrentClassSectionMediumAcademicYear");
const StudentNotes = require("./routes/Student/StudentNotes");
const AssessmentClassSectionMapping = require("./routes/GradeBook/AssessmentClassSectionMapping");
const DownloadFile = require("./routes/Download/download");
const DescriptiveIndicator = require("./routes/GradeBook/DescriptiveIndicator");
const SmsTemplate = require("./routes/Messanger/SmsTemplate");
const BulkSms = require("./routes/Messanger/BulkSms");
const UserTypes = require("./routes/UserType/UserTypes");
//const BulkMessage = require("./routes/Message");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.use("/SchoolUser", SchoolUser);
app.use("/User", User);
app.use("/Userdetails", Userdetails);
app.use("/messageutils", messageutils);
app.use("/InstitutionGroupDetails", InstitutionGroup);
app.use("/userprofile", UserProfile);
app.use("/InstitutionDetails", Institution);
app.use("/SystemSetup", SystemSetup);
app.use("/Employee", Employee);
app.use("/ClassAndSection", ClassAndSection);
app.use("/Medium", Medium);
app.use("/ApplicationForm", ApplicationForm);
app.use("/AcademicYear", AcademicYear);
app.use("/AccountingYear", AccountingYear);
app.use("/AddOnFacility", AddOnFacility);
app.use("/IncomeAccount", IncomeAccount);
app.use("/FeesAccount", FeesAccount);
app.use("/PaymentMethod", PaymentMethod);
app.use("/FeesHeaders", FeesHeaders);
app.use("/FeesTemplate", FeesTemplate);
app.use("/ClassSectionMedium", ClassSectionMedium);
app.use("/Caste", Caste);
app.use("/Pattern", Pattern);
app.use("/Religion", Religion);
app.use("/ReservationCategory", ReservationCategory);
app.use("/SubCaste", SubCaste);
app.use(
  "/ApplicationFormAddOnFacilityMapping",
  ApplicationFormAddOnFacilityMapping
);
app.use("/FileUploadExpress", FileUploadExpress);
app.use("/modules", modules);
app.use("/SubModules", SubModules);
app.use("/UserProfileModuleMapping", UserProfileModuleMapping);
app.use("/Student", Student);
app.use("/Facility", Facility);
app.use("/FacilityFees", FacilityFees);
app.use("/Assets", Assets);
app.use("/Charts", Charts);
app.use("/OpeningBalance", OpeningBalance);
app.use("/ExpenseHeader", ExpenseHeader);
app.use("/ExpenseAccount", ExpenseAccount);
app.use("/Vendors", Vendors);
app.use("/AttendanceSetup", AttendanceSetup);
app.use("/CurrentClassSectionMedium", CurrentClassSectionMedium);
app.use("/AttendanceInsert", AttendanceInsert);
app.use("/Diary", Diary);
app.use("/AttendanceSelect", AttendanceSelect);
app.use("/ReportSetup", ReportSetup);
app.use("/ViewReport", ViewReport);
app.use("/PracticalClasses", PracticalClasses);
app.use("/EventType", EventType);
app.use("/SubjectCombination", SubjectCombination);
app.use("/AdmissionCategory", AdmissionCategory);
app.use("/StudentQuota", StudentQuota);
app.use("/Assessment", Assessment);
app.use("/SubjectPage", SubjectPage);
app.use("/SubjectType", SubjectType);
app.use("/SubjectCombinationMapp", SubjectCombinationMapp);
app.use("/AssessmentHeads", AssessmentHeads);
app.use("/AssignCombination", AssignCombination);
app.use("/Remark", Remark);
app.use("/GradeSetup", GradeSetup);
app.use("/CustomField", CustomField);
app.use("/StudentCatogeries", StudentCatogeries);
app.use("/AdmissionTicket", AdmissionTicket);
app.use("/IndirectAccount", IndirectAccount);
app.use("/Expense", Expense);
app.use("/FeesTemplateFeesAccountMapping", FeesTemplateFeesAccountMapping);
app.use("/InternalTransaction", InternalTransaction);
app.use("/Activities", Activities);
app.use("/Events", Events);
app.use("/ViewAssessment", ViewAssessment);
app.use("/ClassSectionSubjectCombination", ClassSectionSubjectCombination);
app.use(
  "/AssessmentClassSectionMappingMarks",
  AssessmentClassSectionMappingMarks
);
app.use(
  "/AssessmentClassSectionMappingStudentMarks",
  AssessmentClassSectionMappingStudentMarks
);
app.use(
  "/StudentByCurrentClassSectionMediumAcademicYear",
  StudentByCurrentClassSectionMediumAcademicYear
);
app.use("/StudentNotes", StudentNotes);
app.use("/AssessmentClassSectionMapping", AssessmentClassSectionMapping);
app.use("/DownloadFile", DownloadFile);
app.use("/DescriptiveIndicator", DescriptiveIndicator);
app.use("/SmsTemplate", SmsTemplate);
app.use("/BulkSms", BulkSms);
app.use("/UserTypes", UserTypes);
//app.use("/BultMessage", "BulkMessage");

// default route just to check
app.get("/", function (req, res) {
  var en = '';
  if (process.env.NODE_ENV === 'demo') {
    en = 'Started the process in demo mode';
  }
  else if (process.env.NODE_ENV === 'azure') {
    en = 'Started the process in azure mode';
  }
  else {
    en = 'Started the process in production mode';
  }
  return res.send({
    error: false,
    message: "Hello Simpfo!!! " + en,
  });
});

app.post("/FileUpload", upload.single("file"), function (req, res) {
  debug(req.file);
  //console.log('storage location is ', req.hostname + '/' + req.file.path);
  return res.send(req.file.path);
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
const PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});
