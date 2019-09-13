const { Router } = require("express");
const faker = require("faker");
const fetch = require("node-fetch");

const { UserModel } = require("../../models/user.model");
const authenticationService = require("./authentication.service");
const { NotificationModel } = require("../../models/notification.model");

const router = new Router();

const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

const appId = 494781084639844;
const appSecret = "67af8c87511aae2dcb6160ca25fec900";

const fetchAppAccessToken = async () => {
  const parsed = `https://graph.facebook.com/v4.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`;
  const response = await fetch(parsed);
  const data = await response.json();
  return data.access_token;
};

let getAppAccessTokenPromise;
const getAppAccessToken = async () => {
  if (!getAppAccessTokenPromise) {
    getAppAccessTokenPromise = fetchAppAccessToken();
  }
  return getAppAccessTokenPromise;
};

function setAuthToken({ res, jwt, setToExpire }) {
  if (setToExpire) {
    res.cookie("SpeculusAccessToken", jwt, { domain: "speculus.localhost" });
  } else {
    res.cookie("SpeculusAccessToken", jwt, { domain: "speculus.localhost" });
  }
}

router.get("/logout", (req, res) => {
  setAuthToken({ res, jwt: undefined, setToExpire: true });
  res.json({});
});

router.post("/login-with-facebook", csrfProtection, async (req, res) => {
  console.log("login req", req.body);

  const appAccessToken = await getAppAccessToken();
  // const rawResponse = await fetch(
  //   `https://graph.facebook.com/debug_token?input_token=${req.body.accessToken}&access_token=${appAccessToken}`
  // );
  const rawResponse = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${req.body.accessToken}&access_token=${appId}|${appSecret}`
  );

  const response = await rawResponse.json();
  if (req.body.facebookUserId !== response.data.user_id) {
    return res.status(400).json({});
  }
  let user = await UserModel.findOne({
    "facebook.id": req.body.facebookUserId
  });
  console.log("exists?", user);

  if (!user) {
    user = await UserModel.create({
      facebook: {
        id: req.body.facebookUserId,
        email: req.body.email,
        name: req.body.name,
        token: req.body.accessToken
      }
    });
    await NotificationModel.create({
      userToNotify: user,
      notifyOfText: "Welcome to Speculus"
    });
    console.log("create", user);
  } else {
    user = await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        "facebook.id": req.body.facebookUserId,
        "facebook.email": req.body.email,
        "facebook.name": req.body.name,
        "facebook.token": req.body.accessToken
      }
    });
    console.log("update", user);
  }
  console.log("response", response);

  const jwt = await authenticationService.sign({
    userClientSideObject: user.clientSideObject
  });

  setAuthToken({ res, jwt });

  res.json({
    user: user.clientSideObject
  });
});

module.exports = {
  authenticationRouter: router
};
