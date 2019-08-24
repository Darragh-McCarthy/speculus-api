const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userToNotify: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
        commentAuthorFullName: {
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
        ratingAuthorFullName: {
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
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = {
  NotificationModel
};
