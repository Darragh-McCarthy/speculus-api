const { PredictionModel } = require("../predictions/prediction.model");
const { CommentModel } = require("./comment.model");

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
  await PredictionModel.findByIdAndUpdate(predictionId, {
    $inc: { commentsCount: 1 }
  });
  return comment;
}

module.exports = {
  addComment
};
