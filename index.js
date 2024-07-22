const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/user.js");
const Message = require("./models/message.js");
const app = express();
const jwtSecret = "hkhiohihiy8989yh";
const AuthRoute = require("./routers/AuthRoute.js");
const FriendRoute = require("./routers/FriendsRoute.js");
const ChallengeRoute = require("./routers/ChallengeRoute.js");
const PostRoute = require("./routers/PostRoute.js");
const MessageRoute = require("./routers/MessageRoute.js");
const SearchRoute = require("./routers/SearchRoute.js");
const ws = require("ws");
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.1.54:3000"],
  })
);

// mongoose.connect(
//   "mongodb+srv://trantudat03:0lJsRfxt4TwWMh7W@cluster0.egf6rrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// );

mongoose.connect(
  "mongodb+srv://trantudat03:RHOhxRwcnskZIgh7@cluster0.1eofua4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
// password mongodb: 0lJsRfxt4TwWMh7W

try {
  app.use(AuthRoute);
  app.use(FriendRoute);
  app.use(ChallengeRoute);
  app.use(PostRoute);
  app.use(SearchRoute);
  app.use(MessageRoute);
} catch (error) {
  console.log(error);
}
app.get("/test", (req, res) => {
  res.json("test sucssect");
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// app chat

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, firstName: 1, lastName: 1 });
  res.json(users);
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      //   console.log(client);
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  connection.on("message", async (message) => {
    try {
      const messageData = JSON.parse(message.toString());
      const { recipient, text, read } = messageData;

      if (recipient && text) {
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          read,
        });

        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                _id: messageDoc._id,
                recipient,
              })
            )
          );
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  try {
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.trim().startsWith("token=")); // Thêm trim() để loại bỏ khoảng trắng

      if (tokenCookieString) {
        const token = tokenCookieString.split("=")[1];
        if (token) {
          jwt.verify(token, jwtSecret, (err, userData) => {
            if (err) {
              console.error("Token verification failed:", err); // In ra lỗi chi tiết
              return; // Dừng lại nếu xác thực thất bại
            }
            const userId = userData.id;
            //   const username = userData.firstName + " " + userData.lastName;
            connection.userId = userId;
            //   connection.username = username;
            //   console.log(userData);
          });
        }
      }
    }
  } catch (error) {
    console.log("this errr");
  }

  notifyAboutOnlinePeople();
});
