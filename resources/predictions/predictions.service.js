const { PredictionModel } = require("../../models/prediction.model");

async function makePrediction(
  { predictionThisRepliesTo, title, topicTitle },
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
    titleLowerCase: title.toLowerCase(),
    topics:
      typeof topicTitle === "string" && topicTitle.length ? [topicTitle] : []
  });
  return { prediction };
}

module.exports = {
  makePrediction
};
