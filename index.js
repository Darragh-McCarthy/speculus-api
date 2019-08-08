const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const app = express();
const { mocksRouter } = require("./resources/mocks/mocks.router");
const {
  predictionsRouter
} = require("./resources/predictions/predictions.router");
const { topicsRouter } = require("./resources/topics/topics.router");
const {
  authenticationRouter
} = require("./resources/authentication/authentication.router");
const {
  userAccountRouter
} = require("./resources/user-account/user-account.router");
const {
  authMiddleware
} = require("./resources/authentication/authentication.middleware");

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(morgan("dev"));
app.use(cors());

// TODO
app.disable("etag");

const connect = () => {
  return mongoose.connect("mongodb://localhost:27017/myFirstDatabase", {
    useNewUrlParser: true
  });
};

const loggedInRouter = new express.Router();
loggedInRouter.use(authMiddleware);
loggedInRouter.use("/predictions", predictionsRouter);
loggedInRouter.use("/topics", topicsRouter);
loggedInRouter.use("/user-account", userAccountRouter);

app.use("/authentication", authenticationRouter);
app.use("/mocks", mocksRouter);
app.use("/", loggedInRouter);

connect()
  .then(async connection => {
    app.listen(4000);
  })
  .catch(e => console.log(e));
