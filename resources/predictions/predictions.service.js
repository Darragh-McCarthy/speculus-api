const { PredictionModel } = require("./prediction.model");
const { TopicModel } = require("../topics/topic.model");
const { ratePrediction } = require("../ratings/ratings.service");

async function makePrediction(
  { topics, title },
  { userId, fullName, avatarUrl }
) {
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
      fullName,
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
  await ratePrediction(
    {
      predictionId: prediction._id,
      sevenStarLikelihood: 7
    },
    { userId, fullName, avatarUrl }
  );

  return { prediction };
}

module.exports = {
  makePrediction
};
