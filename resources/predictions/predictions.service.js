const { PredictionModel } = require("./prediction.model");

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

async function updateRating(predictionId, rating, userId, avatarUrl, fullName) {
  const prediction = await PredictionModel.findById(predictionId);
  prediction.ratings = prediction.ratings.filter(
    e => !e.author.id.equals(userId)
  );
  if (rating) {
    prediction.ratings.push({
      rating,
      author: {
        id: userId,
        avatarUrl,
        fullName
      },
      createdAt: Date.now()
    });
  }
  await prediction.save();
}

module.exports = {
  addComment,
  updateRating
};
