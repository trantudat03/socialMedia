const Message = require("../models/message.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";
const GetMessageWithUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const ourUserId = userData.id;
        const messages = await Message.find({
          sender: { $in: [userId, ourUserId] },
          recipient: { $in: [userId, ourUserId] },
        }).sort({ createdAt: 1 });
        res.json(messages);
      });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(422).json("Error");
  }
};

const UpdateRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const ourUserId = userData.id;
        const { read } = req.body;
        try {
          const messages = await Message.find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
          }).sort({ createdAt: 1 });
          const messageDoc = messages[messages.length - 1];
          // console.log(messageDoc);
          if (messageDoc) {
            messageDoc.set({
              read,
            });
            await messageDoc.save();
            res.json(messageDoc);
          }
        } catch {
          // console.log("loi o day");
          res.json("loi");
        }
      });
    }
  } catch (error) {
    res.status(422).json("Error");
  }
};

// const Login = async (req, res) => {
//   try {
//   } catch (error) {
//     res.status(422).json("Error");
//   }
// };

module.exports = {
  UpdateRead,
  GetMessageWithUser,
};
