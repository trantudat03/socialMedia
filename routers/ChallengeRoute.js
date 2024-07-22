const express = require("express");
const router = express.Router();
const {
  SendChallengeRequest,
  GetChallengeRequest,
  DeleteChallengeRequest,
  AcceptChallenge,
} = require("../controllers/Challenge");

router.post("/challengeRequest", SendChallengeRequest);
router.post("/acceptChallenge", AcceptChallenge);
router.get("/challengeRequest", GetChallengeRequest);
router.delete("/challengeRequest/:id", DeleteChallengeRequest);

module.exports = router;
