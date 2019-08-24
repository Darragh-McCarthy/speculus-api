const { PredictionModel } = require("../../models/prediction.model");
const { CommentModel } = require("../../models/comment.model");

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
