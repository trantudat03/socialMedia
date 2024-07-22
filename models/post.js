const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    createdAt: { type: Date, default: Date.now }, // Sử dụng Date.now() để lấy thời gian hiện tại của máy tính
    updatedAt: { type: Date, default: Date.now },
  }
  //   { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
