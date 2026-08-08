const extractTextFromReport = async (req, res) => {
  try {
    console.log("REPORT ID:", req.params.id);

    const report = await Report.findById(req.params.id);

    console.log("REPORT:", report);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const result = await Tesseract.recognize(
      report.filePath,
      "eng"
    );

    report.extractedText = result.data.text;

    await report.save();

    res.json({
      success: true,
      extractedText: report.extractedText,
    });
  } catch (error) {
    console.error("OCR ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};