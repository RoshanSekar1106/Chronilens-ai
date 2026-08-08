const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  healthDetective,
} = require("../controllers/aiController");

router.get(
  "/health-detective",
  protect,
  healthDetective
);

module.exports = router;