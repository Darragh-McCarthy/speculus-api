const { Router } = require("express");
const { TopicModel } = require("./topic.model");

const router = new Router();

router.route("/").get(async (req, res) => {
  let promise;
  if (req.query.query) {
    promise = TopicModel.find({ title: new RegExp(req.query.query, "ig") });
  } else {
    promise = TopicModel.find({});
  }
  const sorted = await promise.sort({ title: 1 }).exec();
  res.send({ data: sorted });
});

module.exports = {
  topicsRouter: router
};
