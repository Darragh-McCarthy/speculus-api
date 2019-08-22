const { Router } = require("express");
const { RatingModel } = require("./rating.model");
const { ratePrediction } = require("./ratings.service");

const router = new Router();

router.post("/", async (req, res) => {
  await ratePrediction({
    userId: res.locals.userId,
    predictionId: req.body.predictionId,
    sevenStarLikelihood: req.body.sevenStarLikelihood
  });
  res.json({});
});

module.exports = {
  ratingsRouter: router
};
