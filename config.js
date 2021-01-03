var config = {};

config.sqlUsername = 'sa';
config.sqlPassword = 'S!mpfo2019';
config.sqlhostname = '34.69.201.21';
config.sqlport = '1433';
config.sqldatabase = 'DemoSchool';//'SchoolProject';
config.encrypt = false;

if (process.env.NODE_ENV === 'demo') {
    config.sqldatabase = 'DemoSchool';
    console.log('Started the process in demo mode');
}
else if (process.env.NODE_ENV === 'azure') {
    config.sqlUsername = 'jayadn@school1.database.windows.net';
    config.sqlPassword = 'Welcome123#';
    config.sqlhostname = 'school1.database.windows.net';
    config.sqldatabase = 'Hongirana';
    config.encrypt = true;
    console.log('Started the process in azure mode');
}
else {
    console.log('Started the process in production mode');
}
module.exports = config;

// Start your app server:
// $ node server.js demo

//ENV_VAR=azure pm2 start server.js
//pm2 start ecosystem.config.js --env azure
//https://pm2.io/docs/runtime/best-practices/environment-variables/

// or
//export NODE_ENV=demo
//pm2 start server.js

//Use --update-env to update environment variables
