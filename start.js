/* To start app for devlopment and production added in seperate file */
const app = require('./server.js');
app.listen(process.env.Port || 4001);