const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');


//Import routes
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
const companiesRoute = require('./routes/companies');
const schoolsRoute = require('./routes/schools');
const positionsRoute = require('./routes/position');
const skillsRoute = require('./routes/skills');
const requestsRoute = require('./routes/requests');
const commentsRoute = require('./routes/comments');
const requirementsRoute = require('./routes/requirements');
const notificationsRoute = require('./routes/notifications');
const testRoute = require('./routes/test');
const firebaseRoute = require('./routes/firebase');
const badgeRoute = require('./routes/badge');

const indexRoute = require('./routes'); // --

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/posts', postsRoute);
app.use('/users', usersRoute);
app.use('/companies', companiesRoute);
app.use('/positions', positionsRoute);
app.use('/schools', schoolsRoute);
app.use('/skills', skillsRoute);
app.use('/requests', requestsRoute);
app.use('/comments', commentsRoute);
app.use('/requirements', requirementsRoute);
app.use('/notifications', notificationsRoute);
app.use('/test', testRoute);
app.use('/firebase', firebaseRoute);
app.use('/badge', badgeRoute);
app.use('/', indexRoute);

const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://work-now-3a6c0-default-rtdb.firebaseio.com"
})


// step 3 -- heroku deployment
if (process.env.NODE_ENV === 'production') {

}


//TODO: Connect to db here
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('connected to DB!');
    }
);

//How to we start listening to the server 
//Khi deploy lên heroku thì server sẽ gọi biến PORT ra một cổng ngẫu nhiên, khi dev thì sẽ gọi cổng 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running...');
});