const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://StrixDigital:'+process.env.MONGO_ATLAS_PW+'@shopad.puaj8uc.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, 
useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API Routes ........................................................
const salesofferRoute = require('./api/routes/salesoffer');
const usersRoute = require('./api/routes/users');
const shopRoute = require('./api/routes/shop');
const jobRoute = require('./api/routes/job');
const workRoute = require('./api/routes/work');
const feedbackRoute = require('./api/routes/feedback');
const ratingRoute = require('./api/routes/rating');
const couponRoute = require('./api/routes/coupon');
const chatRoute = require('./api/routes/chat');
const subscriptionRoute = require('./api/routes/subscription');
const jobapplyRoute = require('./api/routes/jobapply');



// End API Routes ....................................................
app.use('/salesoffer', salesofferRoute);
app.use('/user', usersRoute);
app.use('/shop', shopRoute);
app.use('/job', jobRoute);
app.use('/work', workRoute);
app.use('/feedback', feedbackRoute);
app.use('/rating', ratingRoute);
app.use('/coupon', couponRoute);
app.use('/chat', chatRoute);
app.use('/jobapply', jobapplyRoute);

// No Route Error Handler
app.use((req,res,next) => {
    const error = new Error('Uri Not Found');
    error.status = 404;
    next(error);
});

// Global Route Error Handler
app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,   
        }
    });
    });
module.exports = app;