const { PredictionModel } = require("../../models/prediction.model");
const { TopicModel } = require("../../models/topic.model");
const { ratePrediction } = require("../ratings/ratings.service");

async function makePrediction({ topics, title }, { userId, name, avatarUrl }) {
  console.log("makePrediction");
  console.log(topics);
  console.log(title);
  console.log(userId);
  console.log(name);
  console.log(avatarUrl);
  console.log("makePrediction");
  console.log(" ");

  if (topics) {
    const newTopics = topics.filter(e => !e._id);
    await Promise.all(
      newTopics.map(async e =>
        TopicModel.updateOne(
          {
            title: e.title.trim()
          },
          {
            title: e.title.trim(),
            titleLowerCase: e.title.trim().toLowerCase()
          },
          { upsert: true }
        )
      )
    );
  }
  const prediction = await PredictionModel.create({
    author: {
      id: userId,
      name,
      avatarUrl
    },
    title: title,
    titleLowerCase: title.toLowerCase(),
    topics: (topics || []).map(e => ({
      title: e.title,
      titleLowerCase: e.title.trim().toLowerCase(),
      addedBy: userId
    }))
  });
  const rating = await ratePrediction(
    {
      predictionId: prediction._id,
      sevenStarLikelihood: 7
    },
    { id: userId, name, avatarUrl }
  );

  return { prediction, rating };
}

module.exports = {
  makePrediction
};
