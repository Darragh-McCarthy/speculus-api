const { Router } = require("express");
const { CommentModel } = require("../../models/comment.model");
const { addComment } = require("./comments.service");

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

module.exports = {
  commentsRouter: router
};
