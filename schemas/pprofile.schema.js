const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const pprofileSchema = new mongoose.Schema({
  professor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: dbUtill.PROFESSOR},
  schoolName: {
    type: String,
    required: true,
    max: 255,
  },
  college: {
    type: String,
    required: true,
    max: 255,
  },
  department: {
    type: String,
    required: true,
  },
  campusLocation: {
    type: String,
    required: true
  },
  discipline: {
    type: String,
    required: true
  },
  role: [
    {
      type: {
        type: String
      },
      inPerson: {type: Boolean},
      zoom: {type: Boolean}
    }
  ],
  recruitingDepartment: [
    {
      department: {type: String},
      topics: [{type: String}]
    }
  ]
}, {timestamps: true});

module.exports = mongoose.model(dbUtill.PROFPROFILE, pprofileSchema);
