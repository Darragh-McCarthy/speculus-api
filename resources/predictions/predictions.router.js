const { Router } = require("express");
const { PredictionModel } = require("./prediction.model");
const { addComment, updateRating } = require("./predictions.service");

const router = new Router();

function convertPredictionsToBrowserFormat(predictions, userId) {
  return {
    predictions: predictions.map(eachPrediction => {
      const ratingByLoggedInUser = eachPrediction.ratings.find(e =>
        userId.equals(e.author.id)
      );
      const ratingsByOtherUsers = eachPrediction.ratings.filter(
        e => e != ratingByLoggedInUser
      );
      eachPrediction.ratingByLoggedInUser = ratingByLoggedInUser;
      eachPrediction.ratingsByOtherUsers = ratingsByOtherUsers;
      delete eachPrediction.ratings;
      return eachPrediction;
    })
  };
}

router.get("/", async (req, res) => {
  let promise;
  if (req.query.topicTitle) {
    promise = PredictionModel.find({ "topics.title": req.query.topicTitle });
  } else {
    promise = PredictionModel.find({});
  }
  const predictions = await promise.sort("-createdAt").exec();

  await new Promise(resolve => setTimeout(() => resolve(), 500));
  res.json({
    data: convertPredictionsToBrowserFormat(
      JSON.parse(JSON.stringify(predictions)),
      res.locals.userId
    )
  });
});

router.post("/:id/rate", async (req, res) => {
  // try {
  //   await PredictionModel.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       $pull: {
  //         ratings: { "author.id": res.locals.userId }
  //       }
  //     },
  //     { useFindAndModify: false }
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
  // await PredictionModel.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $push: {
  //       ratings: {
  //         rating: req.body.sevenStarLikelihood,
  //         author: {
  //           id: res.locals.userId,
  //           avatarUrl: res.locals.avatarUrl,
  //           fullName: res.locals.fullName
  //         },
  //         createdAt: Date.now()
  //       }
  //     }
  //   },
  //   { upsert: true, useFindAndModify: false }
  // );
  await updateRating(
    req.params.id,
    req.body.sevenStarLikelihood,
    res.locals.userId,
    res.locals.avatarUrl,
    res.locals.fullName
  );
  res.json({});
});

router.post("/:id/comment", async (req, res) => {
  await addComment(
    req.params.id,
    req.body.text,
    res.locals.userId,
    res.locals.avatarUrl,
    res.locals.fullName
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
