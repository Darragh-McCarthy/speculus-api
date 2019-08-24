const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      primary: {
        type: String,
        required: true
      },
      secondary: [
        {
          type: String
        }
      ]
    },
    avatarUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel
};
