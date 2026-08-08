const extractMedicalValues = (text) => {
  const report = {};

  const hemoMatch =
    text.match(
      /Hemoglobin[:\s]*(\d+\.?\d*)/i
    );

  report.hemoglobin =
    hemoMatch
      ? Number(hemoMatch[1])
      : null;

  const tshMatch =
    text.match(
      /TSH[:\s]*(\d+\.?\d*)/i
    );

  report.tsh =
    tshMatch
      ? Number(tshMatch[1])
      : null;

  return report;
};

module.exports =
  extractMedicalValues;