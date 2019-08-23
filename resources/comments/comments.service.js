const { PredictionModel } = require("../predictions/prediction.model");
const { CommentModel } = require("./comment.model");
const { NotificationModel } = require("../notifications/notification.model");

async function addComment(
  predictionId,
  commentText,
  userId,
  avatarUrl,
  fullName,
  sevenStarLikelihood
) {
  const comment = await CommentModel.create({
    prediction: predictionId,
    text: commentText,
    sevenStarLikelihood: sevenStarLikelihood,
    author: {
      id: userId,
      avatarUrl: avatarUrl,
      fullName: fullName
    }
  });
  const prediction = await PredictionModel.findByIdAndUpdate(predictionId, {
    $inc: { commentsCount: 1 }
  });
  return {
    comment,
    prediction
  };
}

module.exports = {
  addComment
};
