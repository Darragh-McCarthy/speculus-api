const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    predictionThisRepliesTo: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction"
    },
    topics: [
      {
        type: String,
        maxlength: 100
      }
    ],
    title: {
      required: true,
      type: String,
      maxlength: 300
    },
    titleLowerCase: {
      required: true,
      type: String,
      maxlength: 300
    },
    author: {
      id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: {
        required: true,
        type: String,
        maxlength: 300
      },
      avatarUrl: {
        required: true,
        type: String,
        maxlength: 1000
      }
    },
    commentsCount: { type: Number, default: 0 },
    predictionRepliesCount: { type: Number, default: 0 },
    userSubmittedReports: [
      {
        authorId: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        reportDetails: {
          type: String,
          required: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const PredictionModel = mongoose.model("Prediction", predictionSchema);

module.exports = {
  PredictionModel
};
