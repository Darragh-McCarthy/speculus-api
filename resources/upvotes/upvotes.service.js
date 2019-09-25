const { UserModel } = require("../../models/user.model");

async function upvotePrediction({ predictionId, userId }) {
  await UserModel.findByIdAndUpdate(userId, {
    $addToSet: predictionId
  });
}

module.exports = {
  upvotePrediction
};
