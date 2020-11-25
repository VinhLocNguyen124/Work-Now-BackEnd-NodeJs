const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Khi deploy lên heroku thì server sẽ gọi biến PORT ra một cổng ngẫu nhiên, khi dev thì sẽ gọi cổng 3000
// step 2 -- heroku deployment
const port = process.env.PORT || 3000;

//Import routes
const postsRoute = require('./routes/posts');
const indexRoute = require('./routes'); // --

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/posts', postsRoute);
app.use('/', indexRoute);

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
app.listen(port);