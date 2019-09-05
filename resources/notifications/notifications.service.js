const { NotificationModel } = require("../../models/notification.model");

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
    .sort("-createdAt")
    .exec();
}

module.exports = {
  notifyOfComment,
  getNotifications
};
