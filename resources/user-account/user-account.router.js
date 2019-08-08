const { Router } = require("express");
const { UserModel } = require("../users/user.model");

const router = new Router();

router.get("/", async (req, res) => {
  const user = await UserModel.findById(res.locals.userId);
  res.json({ data: user });
});

module.exports = {
  userAccountRouter: router
};
