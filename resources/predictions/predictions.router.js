const { Router } = require("express");
const { PredictionModel } = require("./prediction.model");

const router = new Router();

router.get("/", async (req, res) => {
  let promise;
  if (req.query.topicTitle) {
    promise = PredictionModel.find({ "topics.title": req.query.topicTitle });
  } else {
    promise = PredictionModel.find({});
  }
  const predictions = await promise.sort("-createdAt").exec();
  await new Promise(resolve => setTimeout(() => resolve(), 500));
  res.json({ data: predictions });
});

router.post("/:id/rate", async (req, res) => {
  try {
    await PredictionModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          sevenPointLikelihoodRatings: { "author.id": res.locals.userId }
        }
      },
      { useFindAndModify: false }
    );
  } catch (e) {
    console.log(e);
  }
  await PredictionModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        sevenPointLikelihoodRatings: {
          rating: req.body.sevenStarLikelihood,
          author: {
            id: res.locals.userId,
            avatarUrl: res.locals.avatarUrl,
            fullName: res.locals.fullName
          },
          createdAt: Date.now()
        }
      }
    },
    { upsert: true, useFindAndModify: false }
  );
  res.json({});
});

router.post("/:id/comment", async (req, res) => {
  await PredictionModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          text: req.body.text,
          author: {
            id: res.locals.userId,
            avatarUrl: res.locals.avatarUrl,
            fullName: res.locals.fullName
          },
          createdAt: Date.now()
        }
      }
    },
    { upsert: true, useFindAndModify: false }
  );
  res.json({});
});

router.post("/", async (req, res) => {
  if (!req.body.title) {
    return res.status(404).json({ failed: true });
  }
  let topics = [];
  if (req.body.topics) {
    await Promise.all(
      req.body.topics.map(async e => {
        if (e._id) {
          const topic = await TopicModel.findOne({
            _id: e._id
          });
          topics.push(topic);
        } else {
          const topic = await TopicModel.create({
            title: e.title,
            pendingEditorialReview: true
          });
          topics.push(topic);
        }
      })
    );
  }

  try {
    const prediction = await PredictionModel.create({
      author: res.locals.userId,
      title: req.body.title,
      topics
    });
    res.json({
      data: prediction
    });
  } catch (e) {
    res.status(404).json({});
  }
});

module.exports = {
  predictionsRouter: router
};
