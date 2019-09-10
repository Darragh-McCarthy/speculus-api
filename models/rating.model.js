const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      avatarUrl: {
        type: String,
        required: true
      }
    },
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true
    },
    sevenStarLikelihood: {
      required: true,
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7]
    }
  },
  {
    timestamps: true
  }
);

const RatingModel = mongoose.model("Rating", ratingSchema);

module.exports = {
  RatingModel
};
