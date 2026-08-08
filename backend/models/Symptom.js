const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symptomName: {
      type: String,
      required: true,
    },

    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    notes: {
      type: String,
      default: "",
    },

    symptomDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Symptom", symptomSchema);