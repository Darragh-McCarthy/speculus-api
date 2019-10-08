const { UserModel } = require("../../models/user.model");

async function togglePredictionUpvote({
  predictionId,
  commentId,
  userId,
  upvoted
}) {
  // ids not unique across collections, but odds of collision is not worth considering for the prototype
  let update;
  if (predictionId) {
    if (upvoted) {
      update = {
        $addToSet: {
          upvotes: predictionId
        }
      };
    } else {
      update = {
        $pull: {
          upvotes: predictionId
        }
      };
    }
  } else if (commentId) {
    if (upvoted) {
      update = {
        $addToSet: {
          upvotes: commentId
        }
      };
    } else {
      update = {
        $pull: {
          upvotes: commentId
        }
      };
    }
  }

  await UserModel.findByIdAndUpdate(userId, update);
}

module.exports = {
  togglePredictionUpvote
};
