const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userToNotify: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    notifyOfText: {
      required: false,
      type: String
    },
    notifyOfComment: {
      required: false,
      type: {
        commentText: {
          required: true,
          type: String
        },
        commentAuthorName: {
          required: true,
          type: String
        },
        commentAuthorAvatarUrl: {
          required: true,
          type: String
        },
        commentAuthorId: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        predictionTitle: {
          required: true,
          type: String
        },
        predictionId: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prediction"
        }
      }
    },
    notifyOfRating: {
      required: false,
      type: {
        ratingLabel: {
          required: true,
          type: String
        },
        ratingAuthorName: {
          required: true,
          type: String
        },
        ratingAuthorAvatarUrl: {
          required: true,
          type: String
        },
        ratingAuthorId: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        predictionTitle: {
          required: true,
          type: String
        },
        predictionId: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prediction"
        }
      }
    }
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = {
  NotificationModel
};
