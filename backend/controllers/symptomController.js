const Symptom = require("../models/Symptom");

// Add Symptom
const addSymptom = async (req, res) => {
  try {
    const { symptomName, severity, notes } = req.body;

    const symptom = await Symptom.create({
      user: req.user.id,
      symptomName,
      severity,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Symptom Added",
      symptom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Symptoms
const getSymptoms = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      user: userId,
      symptomName: {
        $regex: search,
        $options: "i",
      },
    };

    const total = await Symptom.countDocuments(query);
    const symptoms = await Symptom.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: symptoms.length,
      data: symptoms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch symptoms",
    });
  }
};

// Update Symptom
const updateSymptom = async (req, res) => {
  try {
    const { symptomName, severity, notes } = req.body;
    const symptom = await Symptom.findById(req.params.id);

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: "Symptom Not Found",
      });
    }

    if (symptom.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (symptomName !== undefined) symptom.symptomName = symptomName;
    if (severity !== undefined) symptom.severity = severity;
    if (notes !== undefined) symptom.notes = notes;

    await symptom.save();

    res.status(200).json({
      success: true,
      message: "Symptom Updated",
      symptom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Symptom
const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: "Symptom Not Found",
      });
    }

    await symptom.deleteOne();

    res.status(200).json({
      success: true,
      message: "Symptom Deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Clear All Symptoms for User
const deleteAllSymptoms = async (req, res) => {
  try {
    await Symptom.deleteMany({ user: req.user.id });
    res.status(200).json({
      success: true,
      message: "All Symptoms Cleared",
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
  addSymptom,
  getSymptoms,
  updateSymptom,
  deleteSymptom,
  deleteAllSymptoms,
};