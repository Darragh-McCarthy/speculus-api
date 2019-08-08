const mongoose = require("mongoose");

const logEntrySchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const LogEntryModel = mongoose.model("LogEntry", logEntrySchema);

module.exports = {
  LogEntryModel
};
