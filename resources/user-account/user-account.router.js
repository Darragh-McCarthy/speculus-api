const { Router } = require("express");
const { UserModel } = require("../../models/user.model");
const { getAllRatings } = require("../ratings/ratings.service");
const { getNotifications } = require("../notifications/notifications.service");

const router = new Router();

router.get("/", async (req, res) => {
  const user = await UserModel.findById(res.locals.userId);
  const ratings = await getAllRatings(res.locals.userId);
  const notifications = await getNotifications({ userId: res.locals.userId });
  res.json({ data: { user, ratings, notifications } });
});

module.exports = {
  userAccountRouter: router
};
