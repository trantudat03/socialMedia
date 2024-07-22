const Post = require("../models/post.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";
const User = require("../models/user");
const Comment = require("../models/comment.js");
const CreatePost = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const userId = userData.id; // Lấy userId từ token đã xác thực
        const { description, image } = req.body;

        if (!description) {
          res.status(404).json("Khong co noi dung");
        }

        const post = await Post.create({
          userId: userId,
          description: description,
          image: image,
        });

        const postDoc = await Post.findOne(post._id).populate({
          path: "userId",
          select: `firstName lastName location profileUrl`,
        });

        res.status(200).json({
          success: true,
          message: "Post created successfully",
          data: postDoc,
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    });
  } else {
    res.json(null);
  }
};

const GetAllPosts = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const userId = userData.id;
        const { search } = req.body;
        // const friends = [userId]; // Add user's friends here
        const user = await User.findById(userData.id).select("friends");
        const friends = user?.friends.map((friend) => friend.toString());

        const searchPostQuery = {
          description: { $regex: search, $options: "i" },
        };

        const posts = await Post.find(search ? searchPostQuery : {})
          .populate({
            path: "userId",
            select: `firstName lastName location profileUrl`,
          })
          .sort({ _id: -1 });

        const otherPosts = posts.filter(
          (post) => !friends?.includes(post.userId._id.toString())
        );

        const friendsPosts = posts.filter((post) =>
          friends?.includes(post.userId._id.toString())
        );

        const postsRes = friendsPosts.length > 0 ? friendsPosts : posts;

        res.status(200).json({
          success: true,
          message: "successfully",
          data: postsRes,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  } else {
    res.json(null);
  }
};

const GetPostsPagination = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const user = await User.findById(userData.id).select("friends");
        const friends = user?.friends.map((friend) => friend.toString());

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = (page - 1) * limit;

        const posts = await Post.find({})
          .populate({
            path: "userId",
            select: "firstName lastName location profileUrl",
          })
          .sort({ _id: -1 });

        const friendsPosts = posts.filter((post) =>
          friends?.includes(post.userId._id.toString())
        );

        const postsRes = friendsPosts.length > 0 ? friendsPosts : posts;

        const paginatedPosts = postsRes.slice(startIndex, startIndex + limit);
        const totalPosts = postsRes.length;

        const results = {};
        if (startIndex + limit < totalPosts) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }

        results.results = paginatedPosts;
        const length = paginatedPosts.length;

        res.status(200).json({
          success: true,
          message: "successfully",
          length,
          results,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
      }
    });
  } else {
    res.status(500).json({ message: "Không có token" });
  }
};

const getget = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const startIndex = (page - 1) * limit;

    const results = {};

    const posts = await Post.find().skip(startIndex).limit(limit).exec();

    const totalPosts = await Post.countDocuments().exec();

    if (startIndex + limit < totalPosts) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = posts;
    length = posts.length;

    res.json({ length, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
  }
};

const GetPostByUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy page và limit từ query, thiết lập giá trị mặc định nếu không có
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = (page - 1) * limit;

    // Tìm các bài viết theo userId và sử dụng skip và limit để phân trang
    const posts = await Post.find({ userId: id })
      .populate("userId", "firstName lastName location profileUrl")
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(limit);

    // Tính tổng số bài viết để có thể trả về thông tin phân trang đầy đủ
    const totalPosts = await Post.countDocuments({ userId: id });

    // Tạo kết quả phân trang
    const results = {};
    if (startIndex + limit < totalPosts) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = posts;
    const length = posts.length;

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài viết thành công",
      length,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
  }
};

const CommentPost = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const { comment, from, idPost } = req.body;
        const userId = userData.id;
        // const { id } = req.params;

        if (comment === null) {
          return res.status(404).json({ message: "Comment is required." });
        }
        const newComment = new Comment({
          comment,
          from,
          userId,
          postId: idPost,
        });
        await newComment.save();
        //updating the post with the comments id
        const post = await Post.findById(idPost);
        post.comments.push(newComment._id);
        const updatedPost = await Post.findByIdAndUpdate(idPost, post, {
          new: true,
        });
        res.status(201).json(newComment);
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    });
  } else {
    res.json(null);
  }
};

const GetCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // console.log(postId);
    const postComments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl ",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl ",
      })
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "successfully",
      data: postComments,
    });
  } catch (error) {
    console.log(error);
    req.status(404).json({ message: error.message });
  }
};

const GetReplyByCmt = async (req, res) => {
  try {
    const { cmtId } = req.params;

    // Tìm comment theo cmtId
    const comment = await Comment.findById(cmtId).populate({
      path: "replies.userId",
      select: "firstName lastName location profileUrl",
    });

    // Kiểm tra nếu comment không tồn tại
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Trả về các replies của comment
    res.status(200).json({
      success: true,
      message: "Successfully retrieved replies",
      data: comment.replies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const ReplyComments = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const userId = userData.id;
        const { comment, replyAt, from } = req.body;
        const { id } = req.params;
        if (comment === null) {
          return res.status(404).json({ message: "Comment is required." });
        }
        try {
          const commentInfo = await Comment.findById(id);
          commentInfo.replies.push({
            comment,
            replyAt,
            from,
            userId,
            created_At: Date.now(),
          });
          commentInfo.save();
          res.status(200).json(commentInfo);
        } catch (error) {
          console.log(error);
          res.status(404).json({ message: error.message });
        }
      });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(422).json("Error");
  }
};

const LikePost = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try {
          const userId = userData.id;
          const { id } = req.params;
          const post = await Post.findById(id);
          const index = post.likes.findIndex((pid) => pid === String(userId));
          if (index === -1) {
            post.likes.push(userId);
          } else {
            post.likes = post.likes.filter((pid) => pid !== String(userId));
          }
          const newPost = await Post.findByIdAndUpdate(id, post, {
            new: true,
          });
          res.status(200).json({
            success: true,
            message: "successfully",
            data: newPost,
          });
        } catch (error) {
          console.log(error);
          req.status(404).json({ message: error.message });
        }
      });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(422).json("Error");
  }
};

module.exports = {
  CreatePost,
  GetAllPosts,
  GetPostByUser,
  GetCommentsByPost,
  LikePost,
  ReplyComments,
  CommentPost,
  GetReplyByCmt,
  GetPostsPagination,
};
