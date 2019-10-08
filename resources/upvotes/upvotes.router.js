const { Router } = require("express");
const { togglePredictionUpvote } = require("./upvotes.service");
const csrf = require("csurf");

const router = new Router();
const csrfProtection = csrf({ cookie: true });

router.post("/", csrfProtection, async (req, res) => {
  await togglePredictionUpvote({
    predictionId: req.body.predictionId,
    commentId: req.body.commentId,
    userId: res.locals.user.id,
    upvoted: req.body.upvoted
  });

  res.json({});
});

module.exports = {
  upvotesRouter: router
};
