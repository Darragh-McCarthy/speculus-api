const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
    comments: [
      {
        text: {
          type: String,
          required: true
        },
        author: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          avatarUrl: {
            type: String,
            required: true
          },
          fullName: {
            type: String,
            required: true
          }
        },
        createdAt: {
          type: Date,
          required: true,
          default: Date.now
        }
      }
    ],
    sevenPointLikelihoodRatings: [
      {
        rating: {
          type: Number,
          enum: [
            1, // definitely not
            2, // very unlikely
            3, // unlikely
            4, // as likely as not
            5, // likely
            6, // very likely
            7 // definitely
          ],
          required: true
        },
        author: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          avatarUrl: {
            type: String,
            required: true
          },
          fullName: {
            type: String,
            required: true
          }
        },
        createdAt: {
          type: Date,
          required: true,
          default: Date.now
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
