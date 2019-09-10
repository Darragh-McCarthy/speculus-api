const mongoose = require("mongoose");

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
    }
  },
  { timestamps: true }
);

userSchema.virtual("clientSideObject").get(function() {
  return {
    _id: this._id,
    avatarUrl: `https://graph.facebook.com/${this.facebook.id}/picture`,
    facebook: {
      id: this.facebook.id,
      name: this.facebook.name
    }
  };
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel
};
