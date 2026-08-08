const Symptom = require("../models/Symptom");

const getMissedClues = async (req, res) => {
  try {
    const symptoms = await Symptom.find({
      user: req.user.id,
    });

    const count = {};

    symptoms.forEach((item) => {
      const name = item.symptomName;

      count[name] = (count[name] || 0) + 1;
    });

    const clues = [];

    for (const key in count) {
      if (count[key] >= 2) {
        clues.push(`${key} appears ${count[key]} times`);
      }
    }

    res.json({
      success: true,
      clues,
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
  getMissedClues,
};