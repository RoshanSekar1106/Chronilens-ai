const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

const getDoctorSummary = async (req, res) => {
  try {
    const symptoms = await Symptom.find({
      user: req.user.id,
    });

    const reports = await Report.find({
      userId: req.user.id,
    });

    const symptomList = symptoms.map(s => s.symptomName);

    let summary = "PATIENT SUMMARY\n\n";

    summary += "Main Symptoms:\n";

    [...new Set(symptomList)].forEach(symptom => {
      summary += `• ${symptom}\n`;
    });

    summary += "\nReport Findings:\n";

    reports.forEach(report => {
      if (report.hemoglobin) {
        summary += `Hemoglobin: ${report.hemoglobin}\n`;
      }

      if (report.tsh) {
        summary += `TSH: ${report.tsh}\n`;
      }

      if (report.bloodSugar) {
        summary += `Blood Sugar: ${report.bloodSugar}\n`;
      }
    });

    summary += "\nAI Insights:\n";

    if (reports.some(r => r.tsh > 4.5))
      summary += "• Elevated thyroid marker detected.\n";

    if (reports.some(r => r.hemoglobin < 12))
      summary += "• Low hemoglobin detected.\n";

    summary +=
      "\nRecommendation:\nClinical evaluation and follow-up testing are advised.";

    res.json({
      success: true,
      summary,
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
  getDoctorSummary,
};