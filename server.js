// const http = require("http");
// const app = require("./app");
const port = "5000";
// const server = http.createServer(app);

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.get('/',(req,res)=>{
  res.send('hello world');
});

mongoose
  .connect(
    "mongodb+srv://StrixDigital:Strixdigital2022" +
      "@shopad.puaj8uc.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    // msg = "hello";
    console.log("connected");
    // console.log(new Date(1614470399*1000))
  })
  .catch((err) => {
    console.log("ERROR WHILE CONNECTION DATABASE ");
    console.log(">>>>>>>", err);
  });
// -----
app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

var cors = require("cors");
app.use(cors({ origin: true, credentials: true }));

app.use(function (req, res, next) {
  console.log(req._parsedUrl.path, "----<<<<<<<<<<<Current ");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//

// API Routes ........................................................
const salesofferRoute = require("./api/routes/salesoffer");
const usersRoute = require("./api/routes/users");
const shopRoute = require("./api/routes/shop");
const jobRoute = require("./api/routes/job");
const workRoute = require("./api/routes/work");
const feedbackRoute = require("./api/routes/feedback");
const ratingRoute = require("./api/routes/rating");
const couponRoute = require("./api/routes/coupon");
const chatRoute = require("./api/routes/chat");
const subscriptionRoute = require("./api/routes/subscription");
const jobapplyRoute = require("./api/routes/jobapply");
const likeRoute = require("./api/routes/like");
const commentRoute = require("./api/routes/comment");
const categoryRoute = require("./api/routes/category");

// End API Routes ....................................................
app.use("/salesoffer", salesofferRoute);
// app.use("/salesoffer", salesofferRoute);
app.use("/user", usersRoute);
app.use("/shop", shopRoute);
app.use("/job", jobRoute);
app.use("/work", workRoute);
app.use("/feedback", feedbackRoute);
app.use("/category", categoryRoute);
app.use("/rating", ratingRoute);
app.use("/coupon", couponRoute);
app.use("/chat", chatRoute);
app.use("/subscription", subscriptionRoute);
app.use("/jobapply", jobapplyRoute);
app.use("/like", likeRoute);
app.use("/comment", commentRoute);

// No Route Error Handler
app.use((req, res, next) => {
  const error = new Error("Welcome to Shop API Developed By Strix Digital");
  error.status = 404;
  next(error);
});

// Global Route Error Handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log("port:", port);
});
