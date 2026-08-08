const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const symptoms = await Symptom.countDocuments({ user: userId });

    const reports = await Report.countDocuments({ user: userId });

    // Temporary until Timeline module is built
    const timeline = symptoms + reports;

    // Temporary until AI Insights module is built
    const aiInsights = 4;

    res.status(200).json({
      success: true,
      data: {
        symptoms,
        reports,
        timeline,
        aiInsights,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboardStats,
};