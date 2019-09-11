const express = require("express");
const { UserModel } = require("../../models/user.model");

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const user = await UserModel.findOne({ _id: req.query.id });
  res.json({ data: user.clientSideObject });
});

module.exports = {
  usersRouter
};
