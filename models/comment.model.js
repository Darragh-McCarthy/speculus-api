const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true
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
