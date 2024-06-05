const mongoose = require("mongoose");
const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "User" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "User" },
    requestStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const ChallengeRequest = mongoose.model("challengeRequest", requestSchema);

module.exports = ChallengeRequest;
