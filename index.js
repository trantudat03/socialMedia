const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/user.js");
const FriendRequest = require("./models/friendRequest.js");
const productCategory = require("./models/productCategory.js");
const Product = require("./models/product.js");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const Post = require("./models/post.jsx");
const Comment = require("./models/comment.jsx");
const { profile } = require("console");
const ChallengeRequest = require("./models/challengeRequest.js");
const bcryptSalt = bcrypt.genSaltSync(10);
const app = express();
const jwtSecret = "dat1234456789";
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.1.54:3000"],
  })
);

mongoose.connect(
  "mongodb+srv://trantudat03:0lJsRfxt4TwWMh7W@cluster0.egf6rrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

// password mongodb: 0lJsRfxt4TwWMh7W
app.get("/test", (req, res) => {
  res.json("test sucssect");
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userDoc = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const name = userDoc.name;
    const _id = userDoc.id;
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc.id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;

          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(422).json("fail");
  }
});

app.post("/logout", async (req, res) => {
  // Perform any necessary logout operations
  // For example, clearing session, deleting tokens, etc.

  // Assuming you are using cookies, clear the 'token' cookie
  res.clearCookie("token");

  // Send a response indicating successful logout
  res.json({ message: "Logout successful" });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await User.findById(userData.id);

      res.json(userDoc);
    });
  } else {
    res.json(null);
  }
});

app.get("/user/:id", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { id } = req.params;
      const userDoc = await User.findById(id);

      res.json(userDoc);
    });
  } else {
    res.json(null);
  }
});

app.post("/updateProfile", (req, res) => {
  const { token } = req.cookies;
  const { location, profession, firstName, lastName, profileUrl } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await User.findById(userData.id);
      userDoc.location = location || userDoc.location;
      userDoc.profession = profession || userDoc.profession;
      userDoc.firstName = firstName || userDoc.firstName;
      userDoc.lastName = lastName || userDoc.lastName;
      userDoc.profileUrl = profileUrl || userDoc.profileUrl;
      await userDoc.save();
      res.json(userDoc);
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
});

app.post("/findUserByName", (req, res) => {
  const { text } = req.body;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const regex = new RegExp(text, "i"); // 'i' cho tìm kiếm không phân biệt hoa thường
      const users = await User.find({
        $or: [{ email: regex }, { firstName: regex }],
      });

      res.json(users);
    });
  } else {
    res.json(null);
  }
});

app.post("/friendRequest", async (req, res) => {
  const { requestTo } = req.body;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: "Token invalid." });

      const userId = userData.id;
      try {
        const requestExist = await FriendRequest.findOne({
          requestFrom: userId,
          requestTo,
        });

        if (requestExist) {
          return res
            .status(400)
            .json({ message: "Friend Request already sent." });
        }

        const accountExist = await FriendRequest.findOne({
          requestFrom: requestTo,
          requestTo: userId,
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
});

app.get("/getFriendRequest", async (req, res) => {
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
});

app.post("/acceptRequest", async (req, res) => {
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
});

app.delete("/friendRequest/:id", async (req, res) => {
  //   const userId = req.params.userId;
  //   const requestTo = req.params.requestTo;
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
});

app.post("/challengeRequest", async (req, res) => {
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
});

app.get("/challengeRequest", async (req, res) => {
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
});

app.post("/acceptChallenge", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: "Token invalid." });

      try {
        const userId = userData.id;
        const { rid, status } = req.body;
        const requestExist = await ChallengeRequest.findById(rid);
        if (!requestExist) {
          return res.status(404).json({ message: "No Friend Request Found." });
        }

        const updatedRequest = await ChallengeRequest.findOneAndUpdate(
          { _id: rid },
          { $set: { requestStatus: status } },
          { new: true }
        );

        // if (status === "Accepted") {
        //   const user = await User.findById(userId);
        //   user.friends.push(updatedRequest?.requestFrom);
        //   await user.save();
        //   const friend = await User.findById(updatedRequest?.requestFrom);
        //   friend.friends.push(updatedRequest?.requestTo);
        //   await friend.save();
        // }

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
});

app.delete("/challengeRequest/:id", async (req, res) => {
  //   const userId = req.params.userId;
  //   const requestTo = req.params.requestTo;
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
});

// app.post("/addproductCategory", async (req, res) => {
//   const { typeName } = req.body;
//   try {
//     const typeDoc = await productCategory.create({
//       typeName,
//     });
//     res.json(typeDoc);
//   } catch (e) {
//     res.status(422).json(e);
//   }
// });

// app.get("/productCategory", async (req, res) => {
//   try {
//     res.json(await productCategory.find());
//   } catch (e) {
//     res.status(422).json(e);
//   }
// });

// app.delete("/deleteproductCategory/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     await productCategory.findByIdAndDelete(id);
//     res.json(id);
//   } catch (err) {
//     //console.error(err);
//     res.status(422).json(err);
//   }
// });

// app.get("/products", async (req, res) => {
//   const { token } = req.cookies;
//   if (token) {
//     try {
//       res.json(await Product.find());
//     } catch (e) {
//       res.status(422).json(null);
//     }
//   } else {
//     res.status(422).json(null);
//   }
// });

// app.get("/product/:id", async (req, res) => {
//   const { token } = req.cookies;
//   if (token) {
//     try {
//       const { id } = req.params;
//       const product = await Product.findById(id).populate("owner");
//       res.json(product);
//     } catch (e) {
//       res.status(422).json(null);
//     }
//   } else {
//     res.status(422).json(null);
//   }
// });

// app.put("/product", (req, res) => {
//   const { token } = req.cookies;
//   if (token) {
//     const dateUpdate = moment().format("DD-MM-YYYY HH:mm:ss");
//     const {
//       id,
//       name,
//       productCategory,
//       priceNew,
//       priceOld,
//       description,
//       quantity,
//       images,
//     } = req.body;
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//       try {
//         const productDoc = await Product.findById(id);
//         productDoc.set({
//           name,
//           owner: productCategory,
//           priceNew,
//           priceOld,
//           description,
//           quantity,
//           images,
//           dateUpdate,
//         });
//         await productDoc.save();
//         res.json("ok");
//       } catch {
//         res.status(422).json("fail");
//       }
//     });
//   }
// });

// app.post("/product", (req, res) => {
//   const { token } = req.cookies;
//   const {
//     name,
//     priceNew,
//     priceOld,
//     description,
//     quantity,
//     images,
//     productCategory,
//   } = req.body;
//   const star = 0;
//   const dateUpdate = moment().format("DD-MM-YYYY HH:mm:ss");

//   if (token) {
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//       if (err) throw err;

//       const productDoc = await Product.create({
//         owner: productCategory,
//         name,
//         priceNew,
//         priceOld,
//         description,
//         quantity,
//         images,
//         star,
//         dateUpdate,
//       });
//       res.json(productDoc);
//     });
//   } else {
//     res.status(422).json("fail");
//   }
// });

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

// const { token } = req.cookies;
// if (token) {
//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;
//   });
// } else {
//   res.json(null);
// }

// Post controller

app.post("/createPost", async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const userId = userData.id; // Lấy userId từ token đã xác thực
        const { description, image } = req.body;

        if (!description) {
          return next("You must provide a description");
        }

        const post = await Post.create({
          userId: userId,
          description: description,
          image: image,
        });

        res.status(200).json({
          success: true,
          message: "Post created successfully",
          data: post,
        });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    });
  } else {
    res.json(null);
  }
});

app.get("/getPosts", async (req, res) => {
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
          (post) => !friends.includes(post.userId._id.toString())
        );

        const friendsPosts = posts.filter((post) =>
          friends.includes(post.userId._id.toString())
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
});

// lay ban be cua nguoi dung
app.get("/user/:id/friends", async (req, res) => {
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
});

// lay bai viet cua nguoi dung
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id })
      .populate("userId", "firstName lastName location profileUrl")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Lấy danh sách bài viết thành công",
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
  }
});

app.post("/comment", async (req, res) => {
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
});

app.get("/comment/:postId", async (req, res) => {
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
});

app.post("/replyPostComment/:id", async (req, res) => {
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
});

app.post("/likePost/:id", async (req, res) => {
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
});
app.listen(4000);
