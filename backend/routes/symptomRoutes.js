const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addSymptom,
  getSymptoms,
  updateSymptom,
  deleteSymptom,
  deleteAllSymptoms,
} = require("../controllers/symptomController");

router.post("/", protect, addSymptom);
router.get("/", protect, getSymptoms);
router.put("/:id", protect, updateSymptom);
router.delete("/all", protect, deleteAllSymptoms);
router.delete("/:id", protect, deleteSymptom);

module.exports = router;