const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
// const { urlencoded, json } = require("body-parser");
// const { Prediction, Topic } = require("./mongoose-schemas");
const cors = require("cors");
const predictionsResponse = require("./mocks/predictions.json");
const topicsResponse = require("./mocks/topics.json");

const authService = require("./services/authentication/authentication.service");
const { json, urlencoded } = require("body-parser");

const app = express();

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(morgan("dev"));
app.use(cors());

// TODO
app.disable("etag");
// app.set("etag", false); // turn off

// const connect = () => {
//   return mongoose.connect("mongodb://localhost:27017/myFirstDatabase", {
//     useNewUrlParser: true
//   });
// };
// Add headers
// app.use(function(req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

const authMiddleware = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (authService.verify(token)) {
      next();
    }
  } else {
    res.status(401).json({});
  }
};

app.get("/predictions", authMiddleware, (req, res) => {
  // const predictions = await Prediction.find({});
  res.send(predictionsResponse);
});

app.get("/topics", authMiddleware, (req, res) => {
  // const predictions = await Prediction.find({});
  res.send(topicsResponse);
});

app.post("/login", (req, res) => {
  authService.sign().then(jwt => {
    res.send({
      jwt
    });
  });
});

app.listen(4000);

/*

*/

// connect()
//   .then(async connection => {
//     console.log("connected");
//     app.listen(4000);
//   })
//   .catch(e => console.log(e));

/*
Prediction.deleteMany();
    Topic.deleteMany();

    const topicTitle = "Technology";

    const topic = await Topic.findOneAndUpdate(
      { title: topicTitle },
      { title: topicTitle },
      { upsert: true, new: true, useFindAndModify: false }
    );
    const predictionObj = {
      title: "Turkey will join the EU",
      topic: topic._id
    };
    const prediction = await Prediction.findOneAndUpdate(
      predictionObj,
      predictionObj,
      { upsert: true, new: true, useFindAndModify: false }
    );
    await Prediction.findOneAndUpdate(predictionObj, predictionObj, {
      upsert: true,
      new: true,
      useFindAndModify: false
    });
    await Prediction.findOneAndUpdate(predictionObj, predictionObj, {
      upsert: true,
      new: true,
      useFindAndModify: false
    });

    const matches = await Prediction.find({})
      .populate()
      .exec();
    const topics = await Topic.find({}).exec();

    console.log(topics);
    console.log(matches);

    mongoose.disconnect();
*/
