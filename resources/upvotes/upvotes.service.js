const { UserModel } = require("../../models/user.model");

async function togglePredictionUpvote({ predictionId, userId, upvoted }) {
  if (upvoted) {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: {
        upvotes: predictionId
      }
    });
  } else {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        upvotes: predictionId
      }
    });
  }
}

module.exports = {
  togglePredictionUpvote
};
