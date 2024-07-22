const User = require("../models/user");
const ChallengeRequest = require("../models/challengeRequest.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";

const SendChallengeRequest = async (req, res) => {
  const { requestTo } = req.body;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: "Token invalid." });

      const userId = userData.id;
      try {
        const requestExist = await ChallengeRequest.findOne({
          requestFrom: userId,
          requestTo,
          requestStatus: { $eq: "Pending" }, // Thêm điều kiện requestStatus != "Pending"
        });

        if (requestExist) {
          return res
            .status(400)
            .json({ message: "Friend Request already sent." });
        }

        const accountExist = await ChallengeRequest.findOne({
          requestFrom: requestTo,
          requestTo: userId,
          requestStatus: { $eq: "Pending" },
        });

        if (accountExist) {
          return res
            .status(400)
            .json({ message: "Friend Request already sent." });
        }

        const newRes = await ChallengeRequest.create({
          requestTo,
          requestFrom: userId,
        });
        return res.status(201).json({ message: "Challenge Request sent." });
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
};

const GetChallengeRequest = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: "Token invalid." });

        const userId = userData.id;
        const request = await ChallengeRequest.find({
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

const AcceptChallenge = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: "Token invalid." });

        try {
          const userId = userData.id;
          const { rid, status } = req.body;

          const requestExist = await ChallengeRequest.findById(rid);
          if (!requestExist) {
            return res
              .status(404)
              .json({ message: "No Friend Request Found." });
          }

          const updatedRequest = await ChallengeRequest.findOneAndUpdate(
            { _id: rid },
            { $set: { requestStatus: status } },
            { new: true }
          );
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
  } catch (error) {
    res.status(422).json("Error");
  }
};

const DeleteChallengeRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm và xóa request
    const result = await ChallengeRequest.deleteOne({
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

module.exports = {
  SendChallengeRequest,
  GetChallengeRequest,
  DeleteChallengeRequest,
  AcceptChallenge,
};
