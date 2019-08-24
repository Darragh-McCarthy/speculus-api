const { PredictionModel } = require("../../models/prediction.model");
const { CommentModel } = require("../../models/comment.model");
const { NotificationModel } = require("../../models/notification.model");

async function addComment(
  { predictionId, text, sevenStarLikelihood },
  { userId, avatarUrl, fullName }
) {
  const comment = await CommentModel.create({
    prediction: predictionId,
    text,
    sevenStarLikelihood: sevenStarLikelihood,
    author: {
      id: userId,
      avatarUrl: avatarUrl,
      fullName: fullName
    }
  });
  const prediction = await PredictionModel.findByIdAndUpdate(
    predictionId,
    {
      $inc: { commentsCount: 1 }
    },
    { useFindAndModify: false }
  );

  if (prediction.author.id !== userId) {
    await NotificationModel.create({
      userToNotify: prediction.author.id,
      notifyOfComment: {
        commentText: text,
        commentAuthorFullName: fullName,
        commentAuthorId: userId,
        commentAuthorAvatarUrl: avatarUrl,
        predictionTitle: prediction.title,
        predictionId: prediction._id
      }
    });
  }

  return {
    comment,
    prediction
  };
}

module.exports = {
  addComment
};
