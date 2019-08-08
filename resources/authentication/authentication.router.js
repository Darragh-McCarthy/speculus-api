const { Router } = require("express");
const { UserModel } = require("../users/user.model");
const authenticationService = require("./authentication.service");
const faker = require("faker");

const authenticationRouter = new Router();

authenticationRouter.get("/", async (req, res) => {
  const user = await UserModel.findOne({ "email.primary": req.body.email });
  if (!user) {
    res.status(404).json({});
    return;
  }
  res.json({
    data: user
  });
});

authenticationRouter.post("/login", async (req, res) => {
  const user = await UserModel.findOne({ "email.primary": req.body.email });
  if (!user) {
    res.status(404).json({});
    return;
  }

  const jwt = await authenticationService.sign({
    email: req.body.email,
    userId: user._id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl
  });

  res.json({
    jwt,
    email: user.email,
    userId: user._id,
    avatarUrl: user.avatarUrl
  });
});

authenticationRouter.post("/register", async (req, res) => {
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
  authenticationRouter
};
