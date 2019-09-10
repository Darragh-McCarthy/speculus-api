const { Router } = require("express");
const { UserModel } = require("../../models/user.model");
const { getAllRatings } = require("../ratings/ratings.service");
const { getNotifications } = require("../notifications/notifications.service");
const router = new Router();

router.get("/", async (req, res) => {
  const user = await UserModel.findById(res.locals.user.id);
  if (!user) {
    res.status(401).end();
    return;
  }
  const ratings = await getAllRatings(res.locals.user.id);
  const notifications = await getNotifications({ userId: res.locals.user.id });
  res.json({
    data: { user: user.clientSideObject, ratings, notifications }
  });
});

module.exports = {
  userAccountRouter: router
};
