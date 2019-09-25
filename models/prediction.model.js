const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    predictionThisRepliesTo: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction"
    },
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
