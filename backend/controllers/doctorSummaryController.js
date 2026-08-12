const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

const getDoctorSummary = async (req, res) => {
  try {
    const symptoms = await Symptom.find({ user: req.user.id }).sort({ createdAt: -1 });
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const problems = [];
    let summary = `========================================================================
CHRONILENS AI - PATIENT CLINICAL SUMMARY FOR DOCTORS
========================================================================
Generated On: ${new Date().toLocaleString()}
Hospital Records Analyzed: ${reports.length} Document(s)
Logged Symptom Entries: ${symptoms.length} Record(s)
------------------------------------------------------------------------\n\n`;

    // 1. Analyze Health Problems Across All Hospital Records
    reports.forEach((report, index) => {
      if (report.hemoglobin > 0 && report.hemoglobin < 12) {
        problems.push({
          title: `Low Hemoglobin / Anemia Risk`,
          detail: `Hemoglobin reading of ${report.hemoglobin} g/dL (Normal Range: 12.0 - 16.0 g/dL)`,
          source: report.fileName
        });
      }
      if (report.tsh > 0 && report.tsh > 4.5) {
        problems.push({
          title: `Elevated TSH / Thyroid Dysfunction Risk`,
          detail: `TSH reading of ${report.tsh} mIU/L (Normal Range: 0.4 - 4.5 mIU/L)`,
          source: report.fileName
        });
      }
      if (report.bloodSugar > 0 && report.bloodSugar > 125) {
        problems.push({
          title: `Elevated Blood Sugar / Hyperglycemia Risk`,
          detail: `Fasting Blood Sugar reading of ${report.bloodSugar} mg/dL (Normal Range: 70 - 100 mg/dL)`,
          source: report.fileName
        });
      }
    });

    // Analyze Symptom Problems (Severity >= 7 or repeated symptoms)
    const severeSymptoms = symptoms.filter(s => s.severity >= 7);
    if (severeSymptoms.length > 0) {
      severeSymptoms.forEach(s => {
        problems.push({
          title: `High Severity Symptom: ${s.symptomName}`,
          detail: `Severity Rating: ${s.severity}/10 (Notes: "${s.notes || 'None'}")`,
          source: `Patient Symptom Log (${new Date(s.symptomDate || s.createdAt).toLocaleDateString()})`
        });
      });
    }

    // SECTION 1: TOTAL PROBLEMS IDENTIFIED COUNT
    summary += `[1] IDENTIFIED CLINICAL PROBLEMS (${problems.length} PROBLEM(S) FOUND)\n`;
    summary += `------------------------------------------------------------------------\n`;
    if (problems.length === 0) {
      summary += `✓ 0 Active Problems Found. All analyzed lab biomarkers and symptom logs are within normal target reference ranges.\n\n`;
    } else {
      problems.forEach((p, idx) => {
        summary += `${idx + 1}. [${p.title}]\n   - Findings: ${p.detail}\n   - Source: ${p.source}\n\n`;
      });
    }

    // SECTION 2: ALL UPLOADED HOSPITAL RECORDS BREAKDOWN
    summary += `[2] HOSPITAL RECORDS BREAKDOWN (${reports.length} RECORD(S))\n`;
    summary += `------------------------------------------------------------------------\n`;
    if (reports.length === 0) {
      summary += `• No hospital lab report records uploaded yet.\n\n`;
    } else {
      reports.forEach((r, idx) => {
        summary += `Record #${idx + 1}: ${r.fileName} (Uploaded: ${new Date(r.createdAt).toLocaleDateString()})\n`;
        summary += `  • Hemoglobin : ${r.hemoglobin ? `${r.hemoglobin} g/dL` : 'Not Tested'}${r.hemoglobin && r.hemoglobin < 12 ? ' ⚠️ [BELOW NORMAL]' : ''}\n`;
        summary += `  • TSH (Thyroid): ${r.tsh ? `${r.tsh} mIU/L` : 'Not Tested'}${r.tsh && r.tsh > 4.5 ? ' ⚠️ [ELEVATED]' : ''}\n`;
        summary += `  • Blood Sugar  : ${r.bloodSugar ? `${r.bloodSugar} mg/dL` : 'Not Tested'}${r.bloodSugar && r.bloodSugar > 125 ? ' ⚠️ [HIGH]' : ''}\n`;
        if (r.extractedText) {
          const textSnippet = r.extractedText.replace(/\s+/g, ' ').substring(0, 120);
          summary += `  • Extracted Text Snippet: "${textSnippet}..."\n`;
        }
        summary += `\n`;
      });
    }

    // SECTION 3: PATIENT SYMPTOM LOG SUMMARY
    summary += `[3] PATIENT REPORTED SYMPTOMS (${symptoms.length} LOG(S))\n`;
    summary += `------------------------------------------------------------------------\n`;
    if (symptoms.length === 0) {
      summary += `• No symptom logs reported by patient.\n\n`;
    } else {
      symptoms.forEach(s => {
        summary += `• ${s.symptomName} (Severity: ${s.severity}/10) - Date: ${new Date(s.symptomDate || s.createdAt).toLocaleDateString()}${s.notes ? ` [Notes: "${s.notes}"]` : ''}\n`;
      });
      summary += `\n`;
    }

    // SECTION 4: AI RECOMMENDATIONS & CLINICAL EVALUATION
    summary += `[4] ACTIONABLE CLINICAL GUIDANCE FOR PHYSICIAN\n`;
    summary += `------------------------------------------------------------------------\n`;
    if (problems.some(p => p.title.includes('Anemia'))) {
      summary += `• Recommend Serum Ferritin, TIBC, and Total Iron binding capacity panel.\n`;
    }
    if (problems.some(p => p.title.includes('Thyroid'))) {
      summary += `• Recommend Thyroid Follow-up: Free T3, Free T4, and Thyroid Antibody panel.\n`;
    }
    if (problems.some(p => p.title.includes('Blood Sugar'))) {
      summary += `• Recommend HbA1c testing and Fasting Glucose monitoring.\n`;
    }
    if (problems.length === 0) {
      summary += `• Patient biomarkers appear stable. Continue routine preventive wellness follow-up.\n`;
    } else {
      summary += `• Physician review advised for the ${problems.length} clinical problem(s) identified above.\n`;
    }

    res.json({
      success: true,
      problemsCount: problems.length,
      problems,
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