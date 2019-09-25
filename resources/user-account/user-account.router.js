const { Router } = require("express");
const { UserModel } = require("../../models/user.model");
const { getNotifications } = require("../notifications/notifications.service");
const router = new Router();

router.get("/", async (req, res) => {
  const user = await UserModel.findById(res.locals.user.id);
  if (!user) {
    res.status(401).end();
    return;
  }
  const notifications = await getNotifications({ userId: res.locals.user.id });
  res.json({
    data: { user: user.clientSideObject, notifications }
  });
});

module.exports = {
  userAccountRouter: router
};
