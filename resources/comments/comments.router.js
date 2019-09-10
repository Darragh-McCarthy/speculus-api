const { Router } = require("express");
const { CommentModel } = require("../../models/comment.model");
const { addComment } = require("./comments.service");

const router = new Router();

router.get("/", async (req, res) => {
  const comments = await CommentModel.find({
    prediction: req.query.predictionId
  });

  // setTimeout(() => {
  res.json({
    data: comments
  });
  // }, 1000);
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
