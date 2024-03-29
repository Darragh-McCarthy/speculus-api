const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { json, urlencoded } = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const {
  isLoggedIn
} = require("./resources/authentication/authentication.service");
const { mocksRouter, authenticationRouter } = require("./resources");

const cuid = require("cuid");
const { loggedInRouter } = require("./logged-in.router");

// var xss = require("xss");
// var html = xss('<script>alert("xss");</script>');

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
    origin: [
      "https://127.0.0.1:4200",
      "https://localhost:4200",
      "https://speculus.app",
      "https://speculus.com:4200",
      "https://speculus.localhost:4200",
      "https://www.speculus.com:4200"
    ],
    credentials: true,
    allowedHeaders:
      "X-CSRF-Token, X-XSRF-TOKEN, origin, content-type, accept, authorization"
  })
);

app.use(helmet());

// TODO
app.disable("etag");

const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

app.get("/csrf", csrfProtection, async (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    domain: process.env.csrfCookieDomain,
    secure: true
  });
  res.json({});
});

app.post("/csrf-test", csrfProtection, async (req, res) => {
  res.json({ testing: true });
});

app.use("/authentication", authenticationRouter);
app.use("/mocks", mocksRouter);
app.use("/", loggedInRouter);

const connect = () =>
  mongoose.connect(process.env.mongoConnectionUri, {
    useNewUrlParser: true
  });

module.exports = {
  connect,
  app
};
