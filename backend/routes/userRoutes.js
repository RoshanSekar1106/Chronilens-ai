const protect = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

router.get("/profile", (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: {
      id: "test-user-id"
    }
  });
});

module.exports = router;