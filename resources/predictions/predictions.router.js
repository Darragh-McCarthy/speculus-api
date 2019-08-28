const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("./predictions.service");

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
      topics: req.body.topics,
      title: req.body.title
    },
    res.locals
  );
  res.json({
    data: prediction
  });
});

module.exports = {
  predictionsRouter: router
};