const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 300
    },
    titleLowerCase: {
      type: String,
      required: true,
      maxlength: 300
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String,
        required: true,
        maxlength: 300
      },
      avatarUrl: {
        type: String,
        required: true,
        maxlength: 1000
      }
    },
    topics: [
      {
        title: {
          type: String,
          required: true,
          maxlength: 300
        },
        titleLowerCase: {
          type: String,
          required: true,
          maxlength: 300
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
