const { Router } = require("express");
const faker = require("faker");

const { UserModel } = require("../../models/user.model");
const authenticationService = require("./authentication.service");
const { NotificationModel } = require("../../models/notification.model");

const router = new Router();

router.post("/login", async (req, res) => {
  const user = await UserModel.findOne({ "email.primary": req.body.email });
  if (!user) {
    res.status(404).json({});
    return;
  }

  const jwt = await authenticationService.sign({
    email: user.email.primary,
    userId: user._id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl
  });

  res.json({
    jwt
  });
});

router.post("/register", async (req, res) => {
  const data = {
    fullName: req.body.fullName,
    email: {
      primary: req.body.email
    },
    avatarUrl: faker.image.avatar()
  };

  // TODO: unique
  const user = await UserModel.findOneAndUpdate(data, data, {
    upsert: true,
    new: true,
    useFindAndModify: false
  });

  await NotificationModel.create({
    userToNotify: user,
    notifyOfText: "Welcome to Speculus"
  });

  const jwt = await authenticationService.sign({
    email: req.body.email,
    userId: user._id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl
  });

  res.json({
    jwt
  });
});

module.exports = {
  authenticationRouter: router
};
