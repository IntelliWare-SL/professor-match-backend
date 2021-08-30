const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const lprofileSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    max: 255,
  },
  city: {
    type: String,
    required: true,
    max: 255,
  },
  state: {
    type: String,
    required: true,
    max: 255,
  },
  aboutMe: {
    type: String,
    required: true,
  },
  inPerson: {
    type: Boolean,
  },
  zoom: {
    type: Boolean
  },
  education: [
    {

        level: String, focus: String, school: String

    }
  ]
  ,
  recruitingDepartment: [
    {
      department:  String,
      topics: [{type: String}]
    }
  ],
  socialMedia: [{type: String}]
}, {timestamps: true});

module.exports = mongoose.model(dbUtill.LECPROFILE, lprofileSchema);
