const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMissedClues,
} = require("../controllers/clueController");

router.get(
  "/",
  protect,
  getMissedClues
);

module.exports = router;