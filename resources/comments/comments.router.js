const { Router } = require("express");
const { CommentModel } = require("../../models/comment.model");
const { addComment } = require("./comments.service");
const { NotificationModel } = require("../../models/notification.model");

const router = new Router();

router.get("/", async (req, res) => {
  const comments = await CommentModel.find({
    prediction: req.query.predictionId
  });

  // setTimeout(() => {
  res.json({
    data: comments
  });
  // }, 1000);
});

router.post("/", async (req, res) => {
  const { comment, prediction } = await addComment(
    req.body.predictionId,
    req.body.text,
    res.locals.userId,
    res.locals.avatarUrl,
    res.locals.fullName,
    req.body.sevenStarLikelihood
  );

  if (prediction.author.id !== res.locals.userId) {
    await NotificationModel.create({
      userToNotify: prediction.author.id,
      notifyOfComment: {
        commentText: req.body.text,
        commentAuthorFullName: res.locals.fullName,
        commentAuthorId: res.locals.userId,
        commentAuthorAvatarUrl: res.locals.avatarUrl,
        predictionTitle: prediction.title,
        predictionId: prediction._id
      }
    });
  }

  res.json({
    data: comment
  });
});

module.exports = {
  commentsRouter: router
};
