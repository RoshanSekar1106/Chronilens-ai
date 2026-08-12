const Report = require("../models/Report");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const fs = require("fs");

// Upload Report
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const report = new Report({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report Uploaded Successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reports
const getReports = async (req, res) => {
  try {
    const search = req.query.search || "";
    const reports = await Report.find({
      userId: req.user.id,
      fileName: {
        $regex: search,
        $options: "i",
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// Update Report (Edit Biomarkers / Text)
const updateReport = async (req, res) => {
  try {
    const { fileName, hemoglobin, tsh, bloodSugar, extractedText } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (fileName !== undefined) report.fileName = fileName;
    if (hemoglobin !== undefined) report.hemoglobin = Number(hemoglobin);
    if (tsh !== undefined) report.tsh = Number(tsh);
    if (bloodSugar !== undefined) report.bloodSugar = Number(bloodSugar);
    if (extractedText !== undefined) report.extractedText = extractedText;

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report Updated Successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete All Reports for User
const deleteAllReports = async (req, res) => {
  try {
    await Report.deleteMany({ userId: req.user.id });
    res.status(200).json({
      success: true,
      message: "All Reports Cleared",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OCR & PDF Text Extraction
const extractTextFromReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    let text = "";

    if (report.fileName.toLowerCase().endsWith(".pdf")) {
      // PDF Processing using pdf-parse
      const dataBuffer = fs.readFileSync(report.filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text || "";
    } else {
      // Image OCR Processing using Tesseract.js
      const result = await Tesseract.recognize(report.filePath, "eng");
      text = result.data.text || "";
    }

    report.extractedText = text;

    const hemo = text.match(/Hemoglobin[:\s]*([0-9.]+)/i);
    report.hemoglobin = hemo ? Number(hemo[1]) : 0;

    const tsh = text.match(/TSH[:\s]*([0-9.]+)/i);
    report.tsh = tsh ? Number(tsh[1]) : 0;

    const sugar = text.match(/Blood Sugar.*?([0-9.]+)/i);
    report.bloodSugar = sugar ? Number(sugar[1]) : 0;

    await report.save();

    res.json({
      success: true,
      extractedText: report.extractedText,
      hemoglobin: report.hemoglobin,
      tsh: report.tsh,
      bloodSugar: report.bloodSugar,
    });
  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadReport,
  getReports,
  updateReport,
  deleteReport,
  deleteAllReports,
  extractTextFromReport,
};