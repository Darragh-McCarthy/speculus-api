const mongoose = require("mongoose");
const faker = require("faker");

const userSchema = new mongoose.Schema(
  {
    facebook: {
      required: true,
      type: {
        id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prediction"
      }
    ],
    mockAvatarUrl: {
      type: String
    },
    permissions: {
      includePredictionSubmissionsInPublicCollections: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

userSchema.virtual("clientSideObject").get(function() {
  return {
    _id: this._id,
    // avatarUrl: `https://graph.facebook.com/${this.facebook.id}/picture`,
    avatarUrl: this.mockAvatarUrl,
    facebook: {
      id: this.facebook.id,
      name: this.facebook.name
    },
    upvotes: this.upvotes
  };
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel
};
