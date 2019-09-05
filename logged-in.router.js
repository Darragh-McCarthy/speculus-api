const { Router } = require("express");
const {
  predictionsRouter,
  topicsRouter,
  userAccountRouter,
  authMiddleware,
  ratingsRouter,
  commentsRouter,
  usersRouter
} = require("./resources");

const loggedInRouter = new Router();
loggedInRouter.use(authMiddleware);
loggedInRouter.use("/predictions", predictionsRouter);
loggedInRouter.use("/topics", topicsRouter);
loggedInRouter.use("/user-account", userAccountRouter);
loggedInRouter.use("/ratings", ratingsRouter);
loggedInRouter.use("/comments", commentsRouter);
loggedInRouter.use("/users", usersRouter);

module.exports = {
  loggedInRouter
};
