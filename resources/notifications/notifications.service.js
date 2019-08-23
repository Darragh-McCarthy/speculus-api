const { NotificationModel } = require("./notification.model");

async function notifyOfComment({ userToNotify, predictionId, commentId }) {
  await NotificationModel.create({
    userToNotify,
    prediction: predictionId,
    comment: commentId
  });
}

async function getNotifications({ userId }) {
  return NotificationModel.find({
    userToNotify: userId
  })
    .populate("prediction")
    .populate("rating")
    .populate("comment")
    .exec();
}

module.exports = {
  notifyOfComment,
  getNotifications
};
