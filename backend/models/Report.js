const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    extractedText: {
        type: String,
        default: ""
    },

    hemoglobin: {
        type: Number,
        default: null
    },

    tsh: {
        type: Number,
        default: null
    },

    bloodSugar: {
        type: Number,
        default: null
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Report", reportSchema);  