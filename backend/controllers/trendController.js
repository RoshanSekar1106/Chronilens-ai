const Report = require("../models/Report");

const getTrends = async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({ createdAt: 1 });

    if (reports.length < 2) {
      return res.json({
        success: false,
        message:
          "At least 2 reports required for trend analysis",
      });
    }

    const first = reports[0];
    const last = reports[reports.length - 1];

    let trend = "Stable";
    let risk = "No Risk";

    if (last.hemoglobin < first.hemoglobin) {
      trend = "Decreasing";

      if (last.hemoglobin < 12) {
        risk = "Anemia Risk Increasing";
      }
    }

    if (last.hemoglobin > first.hemoglobin) {
      trend = "Increasing";
    }

    res.json({
      success: true,
      marker: "Hemoglobin",
      firstValue: first.hemoglobin,
      latestValue: last.hemoglobin,
      trend,
      risk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTrends,
};