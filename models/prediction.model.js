const mongoose = require("mongoose");

const predictionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = {
  Prediction
};
