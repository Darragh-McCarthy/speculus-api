const { Router } = require("express");
const { CommentModel } = require("./comment.model");
const { addComment } = require("./comments.service");

const router = new Router();

router.get("/", async (req, res) => {
  const comments = await CommentModel.find({
    prediction: req.query.predictionId
  });
  res.json({
    data: comments
  });
});

router.post("/", async (req, res) => {
  const comment = await addComment(
    req.body.predictionId,
    req.body.text,
    res.locals.userId,
    res.locals.avatarUrl,
    res.locals.fullName,
    req.body.sevenStarLikelihood
  );
  res.json({
    data: comment
  });
});

module.exports = {
  commentsRouter: router
};
