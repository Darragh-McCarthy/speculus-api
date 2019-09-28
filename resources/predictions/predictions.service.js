const { PredictionModel } = require("../../models/prediction.model");
const { togglePredictionUpvote } = require("../upvotes/upvotes.service");

async function makePrediction(
  { predictionThisRepliesTo, title },
  { userId, name, avatarUrl }
) {
  let prediction = await PredictionModel.create({
    predictionThisRepliesTo,
    author: {
      id: userId,
      name,
      avatarUrl
    },
    title: title,
    titleLowerCase: title.toLowerCase()
  });

  // await togglePredictionUpvote({
  //   predictionId: prediction._id,
  //   userId,
  //   upvoted: true
  // });
  return { prediction };
}

module.exports = {
  makePrediction
};
