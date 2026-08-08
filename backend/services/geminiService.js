const {
  GoogleGenerativeAI,
} = require(
  "@google/generative-ai"
);

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const analyzeTimeline =
  async (timeline) => {
    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const prompt = `
Analyze this patient timeline:

${JSON.stringify(timeline)}

Identify:
1. Recurring symptoms
2. Possible health trends
3. Important discussion points for doctors

Return concise insights.
`;

    const result =
      await model.generateContent(
        prompt
      );

    return result.response.text();
  };

module.exports =
  analyzeTimeline;