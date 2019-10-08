const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("./predictions.service");
const { CommentModel } = require("../../models/comment.model");

const router = new Router();

router.get("/", async (req, res) => {
  let query = {};
  if (req.query.q) {
    query.titleLowerCase = new RegExp(req.query.q, "i");
  }
  if (req.query.id) {
    query._id = req.query.id;
  }
  if (req.query.authorId) {
    query["author.id"] = req.query.authorId;
  }
  if (req.query.topicTitle) {
    query.titleLowerCase = req.query.topicTitle.toLowerCase();
  }
  const predictions = await PredictionModel.find(query)
    .sort("-createdAt")
    .limit(10)
    .exec();

  res.json({
    data: predictions
  });
});

router.get("/recent", async (req, res) => {
  const limitMax = 100;
  const limitDefault = 10;
  const limit = Math.min(req.query.count || limitDefault, limitMax);
  let query = {};
  if (
    req.query.lastPredictionId &&
    req.query.lastPredictionId !== "undefined"
  ) {
    query = {
      _id: { $lt: req.query.lastPredictionId }
    };
  }

  const predictions = await PredictionModel.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .exec();

  res.json({
    data: predictions
  });
});

router.get("/search", async (req, res) => {});

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
      if (req.body.predictionThisRepliesTo) {
        const x = await PredictionModel.findByIdAndUpdate(
          req.body.predictionThisRepliesTo,
          {
            $inc: { predictionRepliesCount: 1 }
          }
        );
      }
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
    predictionThisRepliesTo: req.query.predictionId
  });

  res.json({
    data: {
      replies,
      comments
    }
  });
});

router.delete("/", async (req, res) => {
  const prediction = await PredictionModel.findOneAndDelete({
    _id: req.query.predictionId,
    "author.id": res.locals.user.id
  });

  if (prediction.predictionThisRepliesTo) {
    await PredictionModel.findByIdAndUpdate(
      prediction.predictionThisRepliesTo,
      {
        $inc: { predictionRepliesCount: -1 }
      }
    );
  }
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
