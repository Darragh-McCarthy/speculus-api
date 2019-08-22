const { Router } = require("express");
const { UserModel } = require("../users/user.model");
const { getAllRatings } = require("../ratings/ratings.service");

const router = new Router();

router.get("/", async (req, res) => {
  const user = await UserModel.findById(res.locals.userId);
  const ratings = await getAllRatings(res.locals.userId);
  res.json({ data: { user, ratings } });
});

module.exports = {
  userAccountRouter: router
};
