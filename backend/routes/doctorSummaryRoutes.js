const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDoctorSummary,
} = require("../controllers/doctorSummaryController");

router.get(
  "/",
  protect,
  getDoctorSummary
);

module.exports = router;