const express = require("express");
const router = express.Router();
const { UpdateRead, GetMessageWithUser } = require("../controlle" +
  "rs/Message");

router.get("/messages/:userId", GetMessageWithUser);
router.put("/message/:userId", UpdateRead);

module.exports = router;
