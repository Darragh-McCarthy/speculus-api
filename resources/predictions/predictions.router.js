const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("./predictions.service");
const { CommentModel } = require("../../models/comment.model");

const router = new Router();

router.get("/", async (req, res) => {
  let promise;
  if (req.query.id) {
    promise = PredictionModel.find({ _id: req.query.id });
  } else if (req.query.authorId) {
    promise = PredictionModel.find({ "author.id": req.query.authorId });
  } else if (req.query.topicTitle) {
    promise = PredictionModel.find({
      "topics.titleLowerCase": req.query.topicTitle.toLowerCase()
    });
  } else if (req.query.q) {
    promise = PredictionModel.find({ titleLowerCase: new RegExp(req.query.q) });
  } else {
    promise = PredictionModel.find({});
  }
  const predictions = await promise.sort("-createdAt").exec();

  res.json({
    data: predictions
  });
});

router.post("/", async (req, res) => {
  const { prediction } = await makePrediction(
    {
      predictionThisRepliesTo: req.body.predictionThisRepliesTo,
      title: req.body.title
    },
    {
      userId: res.locals.user.id,
      name: res.locals.user.name,
      avatarUrl: res.locals.user.avatarUrl
    }
  );
  res.json({
    data: prediction
  });
});

router.get("/details", async (req, res) => {
  // const replies = await PredictionModel.find({
  //   predictionThisRepliesTo: req.query.predictionId
  // });
  const topics = ["Electric", "2040", "2030", "United Kingdom"];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const replies = await PredictionModel.find({
    title: new RegExp(topic)
  });
  const comments = await CommentModel.find({
    prediction: req.query.predictionId
  });

  res.json({
    data: {
      replies,
      comments
    }
  });
});

router.delete("/", async (req, res) => {
  await PredictionModel.findByIdAndDelete(req.query.predictionId);
  setTimeout(() => {
    res.json({});
  }, 1000);
});

module.exports = {
  predictionsRouter: router
};
