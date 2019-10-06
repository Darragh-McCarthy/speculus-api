const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("./predictions.service");
const { CommentModel } = require("../../models/comment.model");

const router = new Router();

async function searchPredictions({ q, pageNumber }) {
  return await PredictionModel.find({
    titleLowerCase: new RegExp(q, "i")
  })
    .sort("-createdAt")
    .exec();
}

router.get("/", async (req, res) => {
  let predictions;
  if (req.query.q) {
    predictions = await searchPredictions({
      q: req.query.q,
      pageNumber: req.query.pageNumber
    });
  } else if (req.query.id) {
    predictions = await PredictionModel.find({ _id: req.query.id })
      .sort("-createdAt")
      .exec();
  } else if (req.query.authorId) {
    predictions = await PredictionModel.find({
      "author.id": req.query.authorId
    })
      .sort("-createdAt")
      .exec();
  } else if (req.query.topicTitle) {
    predictions = await PredictionModel.find({
      titleLowerCase: req.query.topicTitle.toLowerCase()
    })
      .sort("-createdAt")
      .exec();
  } else {
    predictions = await PredictionModel.find({})
      .sort("-createdAt")
      .exec();
  }

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
