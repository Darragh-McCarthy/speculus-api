const { Router } = require("express");
const { UserModel } = require("../../models/user.model");
const { getAllRatings } = require("../ratings/ratings.service");
const { getNotifications } = require("../notifications/notifications.service");

const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });
const router = new Router();

router.get("/", csrfProtection, async (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token);
  const user = await UserModel.findById(res.locals.userId);
  const ratings = await getAllRatings(res.locals.userId);
  const notifications = await getNotifications({ userId: res.locals.userId });
  res.json({ data: { user, ratings, notifications } });
});

module.exports = {
  userAccountRouter: router
};
