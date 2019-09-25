const { Router } = require("express");
const { upvotePrediction } = require("./upvotes.service");
const { PredictionModel } = require("../../models/prediction.model");
const { NotificationModel } = require("../../models/notification.model");
const csrf = require("csurf");

const router = new Router();
const csrfProtection = csrf({ cookie: true });

router.post("/", csrfProtection, async (req, res) => {
  console.log(res.locals);

  await upvotePrediction(
    {
      predictionId: req.body.predictionId,
      sevenStarLikelihood: req.body.sevenStarLikelihood
    },
    res.locals.user
  );

  const prediction = await PredictionModel.findById(
    req.body.predictionId
  ).select({ title: 1, _id: 1, "author.id": 1 });

  if (
    !prediction.author.id.equals(res.locals.user.id) &&
    req.body.sevenStarLikelihood
  ) {
    // console.log(
    //   typeof prediction.author.id,
    //   typeof res.locals.user.id,
    //   req.body.sevenStarLikelihood
    // );
    await NotificationModel.create({
      userToNotify: prediction.author.id,
      notifyOfRating: {
        ratingAuthorName: res.locals.user.name,
        ratingAuthorId: res.locals.user.id,
        ratingAuthorAvatarUrl: res.locals.user.avatarUrl,
        predictionTitle: prediction.title,
        predictionId: prediction._id
      }
    });
  }

  res.json({});
});

module.exports = {
  upvotesRouter: router
};
