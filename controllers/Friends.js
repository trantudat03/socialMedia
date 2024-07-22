const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";
const FriendRequest = require("../models/friendRequest.js");

const SendFriendRequest = async (req, res) => {
  try {
    const { requestTo } = req.body;
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: "Token invalid." });

        const userId = userData.id;
        // kiem tra xem minh da gui chua
        try {
          const requestExist = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo,
            requestStatus: "Pending",
          });

          if (requestExist) {
            return res
              .status(400)
              .json({ message: "Friend Request already sent." });
          }
          // kiem tra xem nguoi ta da gui chua
          const accountExist = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId,
            requestStatus: "Pending",
          });

          if (accountExist) {
            return res
              .status(400)
              .json({ message: "Friend Request already sent." });
          }

          const newRes = await FriendRequest.create({
            requestTo,
            requestFrom: userId,
          });
          return res.status(201).json({ message: "Friend Request sent." });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
          });
        }
      });
    } else {
      res.status(401).json({ message: "No token provided." });
    }
  } catch (error) {
    res.status(422).json("Error");
  }
};

const GetFriendRequest = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: "Token invalid." });

        const userId = userData.id;
        const request = await FriendRequest.find({
          requestTo: userId,
          requestStatus: "Pending",
        })
          .populate({
            path: "requestFrom",
            select: "firstName lastName profileUrl profession",
          })
          .limit(10)
          .sort({ _id: -1 });

        res.status(200).json({
          success: true,
          data: request,
        });
      });
    } else {
      res.status(401).json({ message: "No token provided." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

const GetAllFriendRequest = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: "Token invalid." });

        const userId = userData.id;

        // Tìm các yêu cầu kết bạn
        const requests = await FriendRequest.find({
          $or: [
            { requestTo: userId, requestStatus: "Pending" }, // Người nhận là userId
            { requestFrom: userId, requestStatus: "Pending" }, // Người gửi là userId
          ],
        })
          .populate({
            path: "requestFrom requestTo",
            select: "firstName lastName profileUrl profession",
          })
          .limit(10)
          .sort({ _id: -1 });

        res.status(200).json({
          success: true,
          data: requests,
        });
      });
    } else {
      res.status(401).json({ message: "No token provided." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

const AcceptRequest = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: "Token invalid." });

      try {
        const userId = userData.id;
        const { rid, status } = req.body;
        const requestExist = await FriendRequest.findById(rid);
        if (!requestExist) {
          return res.status(404).json({ message: "No Friend Request Found." });
        }

        const updatedRequest = await FriendRequest.findOneAndUpdate(
          { _id: rid },
          { $set: { requestStatus: status } },
          { new: true }
        );

        if (status === "Accepted") {
          const user = await User.findById(userId);
          user.friends.push(updatedRequest?.requestFrom);
          await user.save();
          const friend = await User.findById(updatedRequest?.requestFrom);
          friend.friends.push(updatedRequest?.requestTo);
          await friend.save();
        }

        res.status(201).json({
          success: true,
          message: "Friend Request " + status,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server error",
          success: false,
          error: error.message,
        });
      }
    });
  } else {
    res.status(401).json({ message: "No token provided." });
  }
};

const DeleteFriendRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm và xóa request
    const result = await FriendRequest.deleteOne({
      _id: id,
      requestStatus: { $eq: "Pending" }, // Chỉ xóa nếu requestStatus phải là "Pending"
    });

    // Kiểm tra nếu không có request nào bị xóa
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No request found to delete." });
    }

    console.log("Request deleted successfully.");
    return res.status(200).json({ message: "Request deleted successfully." });
  } catch (error) {
    console.error("Error deleting request:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const SuggestedFriends = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const userId = userData.id;
        let queryObject = {};
        queryObject._id = { $ne: userId };
        queryObject.friends = { $nin: userId };
        let queryResult = User.find(queryObject)
          .limit(15)
          .select("firstName lastName profileUrl profession ");
        const suggestedFriends = await queryResult;

        res.status(200).json({
          success: true,
          data: suggestedFriends,
        });
      });
    } else {
      //   res.status(401).json({ success: false, error: "Unauthorized" });
    }
  } catch (error) {
    // console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const UnFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    // console.log(userId + "//" + friendId);
    // Xóa bạn bè từ danh sách của người dùng
    const userDoc = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: friendId },
      },
      { new: true }
    );

    // Xóa người dùng khỏi danh sách bạn bè của bạn
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: "Hủy kết bạn thành công", data: userDoc });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};

// lay ban be cua nguoi dung
const GetFriendByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  SendFriendRequest,
  GetFriendRequest,
  GetAllFriendRequest,
  UnFriend,
  SuggestedFriends,
  DeleteFriendRequest,
  AcceptRequest,
  GetFriendByUser,
};
