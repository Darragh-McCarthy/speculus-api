const express = require("express");
const { UserModel } = require("./user.model");

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const user = await UserModel.findOne({ _id: req.query.id });
  res.json({ data: user });
});

module.exports = {
  usersRouter
};
