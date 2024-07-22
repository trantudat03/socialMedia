const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtSecret = "hkhiohihiy8989yh";
const bcryptSalt = bcrypt.genSaltSync(10);
const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
  } catch (error) {
    res.status(422).json("Error");
  }
};

const Profile = async (req, res) => {
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
};

const LogOut = async (req, res) => {
  // Perform any necessary logout operations
  // For example, clearing session, deleting tokens, etc.

  // Assuming you are using cookies, clear the 'token' cookie
  res.clearCookie("token");

  // Send a response indicating successful logout
  res.json({ message: "Logout successful" });
};

const Signup = async (req, res) => {
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
};

const GetUserById = async (req, res) => {
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
};
const Update = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(401).json({ error: "Error" });
  }
};

const FindByUserName = async (req, res) => {
  try {
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
  } catch (error) {
    res.json("error");
  }
};

module.exports = {
  Profile,
  Login,
  LogOut,
  Signup,
  GetUserById,
  Update,
  FindByUserName,
};
