const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true
    },
    sevenStarLikelihood: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7]
    },
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
    }
  },
  {
    timestamps: true
  }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = {
  CommentModel
};
