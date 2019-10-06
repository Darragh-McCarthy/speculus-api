const { PredictionModel } = require("../../models/prediction.model");
const { CommentModel } = require("../../models/comment.model");
const { NotificationModel } = require("../../models/notification.model");

async function addComment(
  { predictionId, commentId, text },
  { id, avatarUrl, name }
) {
  console.log("commentId", commentId);
  const comment = await CommentModel.create({
    predictionThisRepliesTo: predictionId,
    commentThisRepliesTo: commentId,
    text,
    author: {
      id,
      avatarUrl,
      name
    }
  });
  if (predictionId) {
    const prediction = await PredictionModel.findByIdAndUpdate(
      predictionId,
      {
        $inc: { commentsCount: 1 }
      },
      { useFindAndModify: false }
    );
    // console.log(prediction.author.id.equals(id), id, prediction.author.id);
    if (!prediction.author.id.equals(id)) {
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
  }
  if (commentId) {
    await CommentModel.findByIdAndUpdate(
      commentId,
      {
        $inc: { commentsCount: 1 }
      },
      { useFindAndModify: false }
    );
  }

  return {
    comment
  };
}

module.exports = {
  addComment
};
