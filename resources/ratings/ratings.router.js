const { Router } = require("express");
const { ratePrediction, getRatingLabel } = require("./ratings.service");
const { PredictionModel } = require("../../models/prediction.model");
const { NotificationModel } = require("../../models/notification.model");

const router = new Router();

router.post("/", async (req, res) => {
  await ratePrediction(
    {
      predictionId: req.body.predictionId,
      sevenStarLikelihood: req.body.sevenStarLikelihood
    },
    res.locals
  );

  const prediction = await PredictionModel.findById(
    req.body.predictionId
  ).select({ title: 1, _id: 1, "author.id": 1 });

  if (
    prediction.author.id !== res.locals.userId &&
    req.body.sevenStarLikelihood
  ) {
    await NotificationModel.create({
      userToNotify: prediction.author.id,
      notifyOfRating: {
        ratingLabel: getRatingLabel(req.body.sevenStarLikelihood),
        ratingAuthorFullName: res.locals.fullName,
        ratingAuthorId: res.locals.userId,
        ratingAuthorAvatarUrl: res.locals.avatarUrl,
        predictionTitle: prediction.title,
        predictionId: prediction._id
      }
    });
  }

  res.json({});
});

module.exports = {
  ratingsRouter: router
};
