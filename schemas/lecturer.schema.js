const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const lecturerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 255,
    },
    lastName: {
        type: String,
        required: true,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    type: {
        type: String,
        required: true,
        default:"lecturer"
    } , img:
      {
          data: Buffer,
          contentType: String
      }
}, {timestamps: true});

module.exports = mongoose.model(dbUtill.LECTURER, lecturerSchema);
