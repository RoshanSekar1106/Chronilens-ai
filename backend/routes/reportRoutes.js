const express = require("express");
const multer = require("multer");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  uploadReport,
  getReports,
  updateReport,
  deleteReport,
  deleteAllReports,
  extractTextFromReport,
} = require("../controllers/reportController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("report"), uploadReport);
router.post("/:id/ocr", protect, extractTextFromReport);
router.post("/ocr/:id", protect, extractTextFromReport);
router.get("/", protect, getReports);
router.put("/:id", protect, updateReport);
router.delete("/all", protect, deleteAllReports);
router.delete("/:id", protect, deleteReport);

module.exports = router;