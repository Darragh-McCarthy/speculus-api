const { RatingModel } = require("./rating.model");

async function ratePrediction({ userId, predictionId, sevenStarLikelihood }) {
  const query = {
    user: userId,
    prediction: predictionId
  };
  if (sevenStarLikelihood) {
    await RatingModel.updateOne(
      query,
      {
        user: userId,
        prediction: predictionId,
        sevenStarLikelihood: sevenStarLikelihood
      },
      {
        upsert: true,
        useFindAndModify: false,
        runValidators: true
      }
    );
  } else {
    await RatingModel.findOneAndDelete(query);
  }
}

async function getAllRatings(userId) {
  return RatingModel.find({ user: userId })
    .select({ prediction: 1, _id: 0, sevenStarLikelihood: true })
    .exec();
}

module.exports = {
  getAllRatings,
  ratePrediction
};
