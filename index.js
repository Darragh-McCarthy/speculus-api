const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { json, urlencoded } = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");

const { mocksRouter, authenticationRouter } = require("./resources");

const port = process.env.PORT || 3000;
const cuid = require("cuid");
const { loggedInRouter } = require("./logged-in.router");

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
    origin: ["http://127.0.0.1:4200", "https://speculus.app"],
    credentials: true,
    allowedHeaders:
      "X-CSRF-Token, X-XSRF-TOKEN, origin, content-type, accept, authorization"
  })
);
app.use(helmet());

// TODO
app.disable("etag");

app.use("/authentication", authenticationRouter);
app.use("/mocks", mocksRouter);
app.use("/", loggedInRouter);

const connect = () => {
  const localUri = "mongodb://localhost:27017/myFirstDatabase";
  const atlasUri =
    "mongodb+srv://darragh:Wevb8X2oKr1G633W@cluster0-f8ars.mongodb.net/test?retryWrites=true&w=majority";
  return mongoose.connect(atlasUri, {
    useNewUrlParser: true
  });
};

connect()
  .then(async connection => {
    app.listen(port);
  })
  .catch(e => console.log(e));
