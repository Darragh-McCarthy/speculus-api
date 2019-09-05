const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { json, urlencoded } = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");

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
const { ratingsRouter } = require("./resources/ratings/ratings.router");
const { commentsRouter } = require("./resources/comments/comments.router");
const { usersRouter } = require("./resources/users/users.router");

const Joi = require("@hapi/joi");

const cuid = require("cuid");

const port = process.env.PORT || 3000;

console.log("cuid", cuid());

const schema = Joi.object()
  .keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number()
      .integer()
      .min(1900)
      .max(2013),
    email: Joi.string().email({ minDomainSegments: 2 })
  })
  .with("username", "birthyear")
  .without("password", "access_token");

// Return result.
const result = Joi.validate({ username: "abc", birthyear: 1994 }, schema);
// result.error === null -> valid

// You can also pass a callback which will be called synchronously with the validation result.
Joi.validate({ username: "abc", birthyear: 1994 }, schema, function(
  err,
  value
) {}); // err === null -> valid

app.use(cookieParser());

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://127.0.0.1:4200", "http://speculus.app"],
    credentials: true
  })
);
app.use(helmet());

// TODO
app.disable("etag");

const connect = () => {
  const localUri = "mongodb://localhost:27017/myFirstDatabase";
  const atlasUri =
    "mongodb+srv://darragh:Wevb8X2oKr1G633W@cluster0-f8ars.mongodb.net/test?retryWrites=true&w=majority";
  return mongoose.connect(atlasUri, {
    useNewUrlParser: true
  });
};

app.get("/something", (req, res) => {
  res.cookie("testinganotherheader", "withthis");

  console.log("headers", res.getHeaders());
  // res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
  res.json({
    hello: true
  });
});

const loggedInRouter = new express.Router();
loggedInRouter.use(authMiddleware);
loggedInRouter.use("/predictions", predictionsRouter);
loggedInRouter.use("/topics", topicsRouter);
loggedInRouter.use("/user-account", userAccountRouter);
loggedInRouter.use("/ratings", ratingsRouter);
loggedInRouter.use("/comments", commentsRouter);
loggedInRouter.use("/users", usersRouter);

app.use("/authentication", authenticationRouter);
app.use("/mocks", mocksRouter);
app.use("/", loggedInRouter);

connect()
  .then(async connection => {
    app.listen(port);
  })
  .catch(e => console.log(e));
