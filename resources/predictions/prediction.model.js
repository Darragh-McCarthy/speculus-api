const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    titleLowercase: {
      type: String,
      required: true
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      fullName: {
        type: String,
        required: true
      },
      avatarUrl: {
        type: String,
        required: true
      }
    },
    topics: [
      {
        title: {
          type: String,
          required: true
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      }
    ],
    commentsCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

const PredictionModel = mongoose.model("Prediction", predictionSchema);

module.exports = {
  PredictionModel
};
