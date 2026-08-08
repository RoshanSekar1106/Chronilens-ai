const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

const generateTimeline = require("../utils/generateTimeline");

const analyzeTimeline = require("../services/geminiService");

const healthDetective = async (req, res) => {
  try {
    const symptoms = await Symptom.find({
      user: req.user.id,
    });

    const reports = await Report.find({
      userId: req.user.id,
    });

    const timeline = generateTimeline(
      symptoms,
      reports
    );

    const insights =
      await analyzeTimeline(timeline);

    res.json({
      success: true,
      timeline,
      insights,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI Analysis Failed",
    });
  }
};

module.exports = {
  healthDetective,
};