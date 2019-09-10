const { PredictionModel } = require("../../models/prediction.model");
const { CommentModel } = require("../../models/comment.model");
const { NotificationModel } = require("../../models/notification.model");

async function addComment(
  { predictionId, text, sevenStarLikelihood },
  { id, avatarUrl, name }
) {
  console.log("addComment");
  console.log(predictionId);
  console.log(text);
  console.log(sevenStarLikelihood);
  console.log(avatarUrl);
  console.log(name);
  console.log("addComment");
  console.log(" ");

  const comment = await CommentModel.create({
    prediction: predictionId,
    text,
    sevenStarLikelihood: sevenStarLikelihood,
    author: {
      id,
      avatarUrl: avatarUrl,
      name
    }
  });
  const prediction = await PredictionModel.findByIdAndUpdate(
    predictionId,
    {
      $inc: { commentsCount: 1 }
    },
    { useFindAndModify: false }
  );

  if (prediction.author.id !== id) {
    await NotificationModel.create({
      userToNotify: prediction.author.id,
      notifyOfComment: {
        commentText: text,
        commentAuthorName: name,
        commentAuthorId: id,
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
