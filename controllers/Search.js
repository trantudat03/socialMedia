const Message = require("../models/message.js");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";
const Post = require("../models/post.js");
const SearchByKeyWord = async (req, res) => {
  try {
    const query = req.query.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Tìm kiếm người dùng theo lastName hoặc firstName, giới hạn kết quả là 6 người dùng
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).limit(6);

    // Lấy danh sách userId từ kết quả tìm kiếm người dùng
    const userIds = users.map((user) => user._id);

    // Tìm kiếm bài viết có userId nằm trong danh sách userId tìm thấy ở trên
    const posts = await Post.find({
      userId: { $in: userIds },
    })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      posts,
      page,
      limit,
    });
  } catch (error) {
    res.status(422).json("Error");
  }
};

module.exports = { SearchByKeyWord };
