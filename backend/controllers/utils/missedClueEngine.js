const findMissedClues = (
  symptoms
) => {
  const symptomCount = {};

  symptoms.forEach((item) => {
    symptomCount[item.symptomName] =
      (symptomCount[
        item.symptomName
      ] || 0) + 1;
  });

  const clues = [];

  Object.keys(symptomCount).forEach(
    (symptom) => {
      if (
        symptomCount[symptom] >= 3
      ) {
        clues.push(
          `${symptom} appears ${symptomCount[symptom]} times`
        );
      }
    }
  );

  return clues;
};

module.exports =
  findMissedClues;