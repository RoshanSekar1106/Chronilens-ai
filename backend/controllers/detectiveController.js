const Report = require("../models/Report");

const detectHealthIssues = async (req, res) => {
  try {
    const report = await Report.findOne({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

   const findings = [];

if (report.hemoglobin > 0) {
  if (report.hemoglobin < 12) {
    findings.push("Possible Anemia");
  } else {
    findings.push("Hemoglobin Normal");
  }
}

if (report.tsh > 0) {
  if (report.tsh > 4.5) {
    findings.push("Possible Hypothyroidism");
  } else {
    findings.push("TSH Normal");
  }
}

if (report.bloodSugar > 0) {
  if (report.bloodSugar > 125) {
    findings.push("High Blood Sugar Risk");
  } else {
    findings.push("Blood Sugar Normal");
  }
}
    res.json({
      success: true,
      findings,
      recommendation:
        "Consult an endocrinologist and review iron studies.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  detectHealthIssues,
};