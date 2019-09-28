const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("./predictions.service");
const { CommentModel } = require("../../models/comment.model");

const router = new Router();

router.get("/", async (req, res) => {
  let cursor;
  if (req.query.id) {
    cursor = PredictionModel.find({ _id: req.query.id });
  } else if (req.query.authorId) {
    cursor = PredictionModel.find({ "author.id": req.query.authorId });
  } else if (req.query.topicTitle) {
    cursor = PredictionModel.find({
      titleLowerCase: req.query.topicTitle.toLowerCase()
    });
  } else {
    cursor = PredictionModel.find({});
  }
  const predictions = await cursor.sort("-createdAt").exec();

  res.json({
    data: predictions
  });
});

router.get("/search", async (req, res) => {
  let predictions = await PredictionModel.find({
    titleLowerCase: new RegExp(req.query.q, "i")
  })
    .sort("-createdAt")
    .exec();

  res.json({
    data: predictions
  });
});

router.post("/", async (req, res) => {
  if (Math.random() > 0.5) {
    setTimeout(() => {
      res.status(400).json({});
    }, 1000);
  } else {
    try {
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
      setTimeout(() => {
        res.json({
          data: prediction
        });
      }, 1000);
    } catch (e) {
      return res.status(400).json({});
    }
  }
});

router.get("/details", async (req, res) => {
  const replies = await PredictionModel.find({
    predictionThisRepliesTo: req.query.predictionId
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
  await PredictionModel.deleteOne({
    _id: req.query.predictionId,
    "author.id": res.locals.user.id
  });
  setTimeout(() => {
    res.json({});
  }, 1000);
});

router.post("/report", async (req, res) => {
  await PredictionModel.findByIdAndUpdate(req.query.predictionId, {
    $push: {
      userSubmittedReports: {
        authorId: res.locals.user.id,
        reportDetails: req.query.reportDetails
      }
    }
  });
  setTimeout(() => {
    res.json({});
  }, 1000);
});

module.exports = {
  predictionsRouter: router
};
