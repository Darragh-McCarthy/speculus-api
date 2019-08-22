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
            title: e.title
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
    titleLowercase: title.toLowerCase(),
    topics: (topics || []).map(e => ({
      title: e.title,
      addedBy: userId
    }))
  });
  await ratePrediction({
    predictionId: prediction._id,
    sevenStarLikelihood: 7,
    userId
  });

  return { prediction };
}

async function addComment(
  predictionId,
  commentText,
  userId,
  avatarUrl,
  fullName
) {
  const prediction = await PredictionModel.findById(predictionId);
  const rating = prediction.ratings.find(e => e.author.id.equals(userId));
  prediction.comments.push({
    rating: rating && rating.rating,
    text: commentText,
    author: {
      id: userId,
      avatarUrl,
      fullName
    },
    createdAt: Date.now()
  });
  await prediction.save();
}

module.exports = {
  addComment,
  makePrediction
};
