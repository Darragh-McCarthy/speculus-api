const { PredictionModel } = require("../../models/prediction.model");
const { upvotePrediction } = require("../upvotes/upvotes.service");

async function makePrediction(
  { predictionThisRepliesTo, title },
  { userId, name, avatarUrl }
) {
  const prediction = await PredictionModel.create({
    predictionThisRepliesTo,
    author: {
      id: userId,
      name,
      avatarUrl
    },
    title: title,
    titleLowerCase: title.toLowerCase()
  });

  await upvotePrediction({ predictionId: prediction._id, userId });
  return { prediction };
}

module.exports = {
  makePrediction
};
