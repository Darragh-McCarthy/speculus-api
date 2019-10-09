const { Router } = require("express");
const { CommentModel } = require("../../models/comment.model");
const { addComment } = require("./comments.service");
const { PredictionModel } = require("../../models/prediction.model");

const router = new Router();

router.get("/", async (req, res) => {
  let comments;
  if (req.query.predictionId) {
    comments = await CommentModel.find({
      predictionThisRepliesTo: req.query.predictionId
    });
  } else if (req.query.commentId) {
    comments = await CommentModel.find({
      commentThisRepliesTo: req.query.commentId
    });
  }

  res.json({
    data: comments
  });
});

router.post("/", async (req, res) => {
  const { comment } = await addComment(req.body, res.locals.user);
  res.json({
    data: comment
  });
});

router.delete("/", async (req, res) => {
  const prediction = await CommentModel.findOneAndDelete({
    _id: req.query.commentId,
    "author.id": res.locals.user.id
  });

  if (prediction.predictionThisRepliesTo) {
    await PredictionModel.findByIdAndUpdate(
      prediction.predictionThisRepliesTo,
      {
        $inc: { commentsCount: -1 }
      }
    );
  }
  res.json({});
});

module.exports = {
  commentsRouter: router
};
