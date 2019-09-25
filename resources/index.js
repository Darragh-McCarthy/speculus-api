const { mocksRouter } = require("./mocks/mocks.router");
const { predictionsRouter } = require("./predictions/predictions.router");
const { topicsRouter } = require("./topics/topics.router");
const {
  authenticationRouter
} = require("./authentication/authentication.router");
const { userAccountRouter } = require("./user-account/user-account.router");
const {
  authMiddleware
} = require("./authentication/authentication.middleware");
const { upvotesRouter } = require("./upvotes/upvotes.router");
const { commentsRouter } = require("./comments/comments.router");
const { usersRouter } = require("./users/users.router");

module.exports = {
  mocksRouter,
  predictionsRouter,
  topicsRouter,
  authenticationRouter,
  userAccountRouter,
  authMiddleware,
  upvotesRouter,
  commentsRouter,
  usersRouter
};
