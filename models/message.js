const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    file: String,
    read: Boolean,
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
