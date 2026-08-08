const generateHealthTimeline = (symptoms, reports) => {
  const timeline = [];

  symptoms.forEach((symptom) => {
    timeline.push({
      date: symptom.createdAt,
      type: "Symptom",
      title: symptom.symptomName,
      severity: symptom.severity,
    });
  });

  reports.forEach((report) => {
    timeline.push({
      date: report.createdAt,
      type: "Report",
      title: report.fileName,
    });
  });

  timeline.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return timeline;
};

module.exports = generateHealthTimeline;