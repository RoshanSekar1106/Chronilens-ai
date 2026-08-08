const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getSummary,
} = require("../controllers/summaryController");

router.get("/", protect, getSummary);

module.exports = router;