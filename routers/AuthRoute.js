const {
  Login,
  Profile,
  LogOut,
  Signup,
  GetUserById,
  Update,
  FindByUserName,
} = require("../controllers/Auth");

const express = require("express");
const router = express.Router();

router.get("/profile", Profile);
router.get("/user/:id", GetUserById);
router.post("/login", Login);
router.post("/logout", LogOut);
router.post("/signup", Signup);
router.post("/updateProfile", Update);
router.post("/findUserByName", FindByUserName);
// app.get("/user/:id", (req, res) => {});
// app.post("/updateProfile", (req, res) => {});
// app.post("/findUserByName", (req, res) => {});
module.exports = router;
