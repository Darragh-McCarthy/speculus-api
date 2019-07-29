const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const { Prediction } = require("./models/prediction.model");
const { Topic } = require("./models/topic.model");
const cors = require("cors");
const topicsResponse = require("./mocks/topics.mock.json");

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

const connect = () => {
  return mongoose.connect("mongodb://localhost:27017/myFirstDatabase", {
    useNewUrlParser: true
  });
};
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
    authService
      .verify(token)
      .then(() => next(), () => res.status(401).json({}));
  } else {
    res.status(401).json({});
  }
};

app.get("/populate-mock-data", authMiddleware, async (req, res) => {
  const predictionsResponse = JSON.parse(
    JSON.stringify(require("./mocks/predictions.mock.json"))
  );
  await Topic.deleteMany();
  await Prediction.deleteMany();
  await Promise.all(
    predictionsResponse.data
      .map(e => e.topics)
      .reduce((a, b) => {
        b.forEach(eachTopic => {
          if (a.indexOf(eachTopic) === -1) {
            a.push(eachTopic);
          }
        });
        return a;
      }, [])
      .map(e => Topic.create(e))
  );
  const topics = await Topic.find({});
  predictionsResponse.data.forEach(e => {
    e.topics = e.topics.map(eachTopic => {
      return topics.find(eachObj => eachObj.title === eachTopic.title);
    });
  });

  await Prediction.create(predictionsResponse.data);
  await Prediction.find({});
  return res.json({});
});

app.get("/clear-mock-data", authMiddleware, async (req, res) => {
  await Topic.deleteMany();
  await Prediction.deleteMany();
  return res.json({});
});

app.get("/predictions", authMiddleware, async (req, res) => {
  let promise;
  console.log(req.query);
  if (req.query.topicId) {
    promise = Prediction.find({ topics: req.query.topicId });
  } else {
    promise = Prediction.find({});
  }
  const predictions = await promise.populate("topics").exec();
  await new Promise(resolve => setTimeout(() => resolve(), 300));
  res.json({ data: predictions });
});

app.post("/predictions", authMiddleware, async (req, res) => {
  if (!req.body.title) {
    return res.status(404).json({ failed: true });
  }
  await Prediction.create({
    title: req.body.title
  }).then(() => res.json({}), () => res.status(404).json({ failed: true }));
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

connect()
  .then(async connection => {
    app.listen(4000);
  })
  .catch(e => console.log(e));

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
