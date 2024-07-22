const express = require("express");
const router = express.Router();
const {
  CreatePost,
  GetAllPosts,
  GetPostByUser,
  GetCommentsByPost,
  LikePost,
  ReplyComments,
  CommentPost,
  GetReplyByCmt,
  GetPostsPagination,
} = require("../controllers/Post");

router.post("/createPost", CreatePost);
router.post("/comment", CommentPost);
router.post("/replyPostComment/:id", ReplyComments);
router.post("/likePost/:id", LikePost);
router.get("/getPosts", GetAllPosts);
router.get("/posts/:id", GetPostByUser);
router.get("/comment/:postId", GetCommentsByPost);
router.get("/reply/:cmtId", GetReplyByCmt);
router.get("/posts", GetPostsPagination);

module.exports = router;
