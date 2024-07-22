const express = require("express");
const router = express.Router();
const {
  SendFriendRequest,
  GetFriendRequest,
  GetAllFriendRequest,
  UnFriend,
  SuggestedFriends,
  DeleteFriendRequest,
  AcceptRequest,
  GetFriendByUser,
} = require("../controllers/Friends");

router.get("/getFriendRequest", GetFriendRequest);
router.get("/getFriendRequestAll", GetAllFriendRequest);
router.get("/suggestedFriends", SuggestedFriends);
router.get("/user/:id/friends", GetFriendByUser);
router.post("/acceptRequest", AcceptRequest);
router.post("/friendRequest", SendFriendRequest);
router.put("/unFriend", UnFriend);
router.delete("/friendRequest/:id", DeleteFriendRequest);

module.exports = router;
