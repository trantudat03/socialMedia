const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,

  location: { type: String },
  profileUrl: { type: String },
  profession: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  views: [{ type: String }],
  verified: { type: Boolean, default: false },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
