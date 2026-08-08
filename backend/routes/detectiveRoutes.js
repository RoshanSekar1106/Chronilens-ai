const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  detectHealthIssues,
} = require("../controllers/detectiveController");

router.get(
  "/",
  protect,
  detectHealthIssues
);

module.exports = router;