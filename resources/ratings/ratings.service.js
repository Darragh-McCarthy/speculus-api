const { RatingModel } = require("../../models/rating.model");

async function ratePrediction(
  { predictionId, sevenStarLikelihood },
  { userId, fullName, avatarUrl }
) {
  const query = {
    "author.id": userId,
    prediction: predictionId
  };
  if (sevenStarLikelihood) {
    const rating = await RatingModel.findOneAndUpdate(
      query,
      {
        author: {
          id: userId,
          avatarUrl,
          fullName
        },
        prediction: predictionId,
        sevenStarLikelihood: sevenStarLikelihood
      },
      {
        upsert: true,
        useFindAndModify: false,
        runValidators: true,
        new: true
      }
    );
  } else {
    await RatingModel.findOneAndDelete(query);
  }
}

function getRatingLabel(rating) {
  return {
    1: "Definitely not",
    2: "Very unlikely",
    3: "Unlikely",
    4: "Possibly",
    5: "Likely",
    6: "Very likely",
    7: "Definitely"
  }[rating];
}

async function getAllRatings(userId) {
  return RatingModel.find({ "author.id": userId })
    .select({ prediction: 1, _id: 0, sevenStarLikelihood: true })
    .exec();
}

module.exports = {
  getAllRatings,
  ratePrediction,
  getRatingLabel
};
