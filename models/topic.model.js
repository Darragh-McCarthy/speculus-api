const mongoose = require("mongoose");

const topicSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    pendingEditorialReview: {
      type: Boolean,
      default: true
    },
    includeInDirectory: {
      type: Boolean,
      default: false
    },
    includeInPredictionTopicsList: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const TopicModel = mongoose.model("Topic", topicSchema);

module.exports = {
  TopicModel
};
