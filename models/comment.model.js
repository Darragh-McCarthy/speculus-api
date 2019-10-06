const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    predictionThisRepliesTo: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction"
    },
    commentThisRepliesTo: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },
    text: {
      type: String,
      required: true,
      maxLength: 1000
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
      name: {
        type: String,
        required: true
      }
    },
    commentsCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = {
  CommentModel
};
