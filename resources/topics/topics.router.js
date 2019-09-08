const { Router } = require("express");
const { TopicModel } = require("../../models/topic.model");
const router = new Router();

router.route("/").get(async (req, res) => {
  let promise;
  if (req.query.query) {
    promise = TopicModel.find({ title: new RegExp(req.query.query, "ig") });
  } else {
    promise = TopicModel.find({ includeInDirectory: true });
  }
  const sorted = await promise
    .sort({ title: 1 })
    .select({
      title: 1,
      _id: 0
    })
    .exec();
  res.send({ data: sorted });
});

module.exports = {
  topicsRouter: router
};
