const Report = require("../models/Report");

const getTimeline = async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user.id,
    }).sort({ createdAt: 1 });

    const timeline = [];

    reports.forEach((report) => {
      if (report.hemoglobin > 0) {
        timeline.push({
          date: report.createdAt,
          event: `Hemoglobin: ${report.hemoglobin}`,
        });

        if (report.hemoglobin < 12) {
          timeline.push({
            date: report.createdAt,
            event: "Possible Anemia Risk",
          });
        }
      }

      if (report.tsh > 0) {
        timeline.push({
          date: report.createdAt,
          event: `TSH: ${report.tsh}`,
        });

        if (report.tsh > 4.5) {
          timeline.push({
            date: report.createdAt,
            event: "Elevated Thyroid Marker",
          });
        }
      }
    });

    res.json({
      success: true,
      timeline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getTimeline };