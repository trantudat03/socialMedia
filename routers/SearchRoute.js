const express = require("express");
const router = express.Router();
const { SearchByKeyWord } = require("../controllers/Search");

router.get("/search", SearchByKeyWord);

module.exports = router;
