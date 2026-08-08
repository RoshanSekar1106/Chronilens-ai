const Report = require("../models/Report");

const getSummary = async (req, res) => {
  try {
    const report = await Report.findOne({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No reports found",
      });
    }

    let summary = "";

    if (report.hemoglobin < 12) {
      summary +=
        "Low hemoglobin detected. Possible anemia. ";
    } else {
      summary +=
        "Hemoglobin within normal range. ";
    }

    if (report.tsh > 4.5) {
      summary +=
        "Elevated TSH detected. Possible thyroid dysfunction. ";
    }

    if (
      report.bloodSugar > 0 &&
      report.bloodSugar <= 100
    ) {
      summary +=
        "Blood sugar appears normal.";
    }

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSummary,
};