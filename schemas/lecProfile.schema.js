const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");
const {boolean} = require("joi");

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
      type: {
        level: {type: String}, focus: {type: String}, school: {type: String}
      }
    }
  ]
  ,
  recruitingDepartment: [
    {
      department: {type: String},
      topics: [{type: String}]
    }
  ],
  socialMedia: [{type: String}]
}, {timestamps: true});

module.exports = mongoose.model(dbUtill.LECPROFILE, lprofileSchema);
