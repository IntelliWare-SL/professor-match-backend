const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Lecturer = require("../schemas/lecturer.schema");
const moment = require("moment");
const proProfile = require("../schemas/pprofile.schema");
const Professor = require("../schemas/professor.schema");
const lecProfile = require("../schemas/lecProfile.schema")
const fs = require('fs');
const _ = require("lodash");
const sgMail = require('@sendgrid/mail')

const sendEmails = async function (data) {
  let filter = []
  let selectedByInPerson = [];
  let selectedByZoom =[];
  if (data.inPerson){
    filter = [{type:data.type},{inPerson:true}]
    selectedByInPerson = await proProfile.find({
      role: {
        $elemMatch: {$and:filter}
      }
    })
  }
  if (data.zoom){
    filter = [{type:data.type},{zoom:true}]
    selectedByZoom = await proProfile.find({
      role: {
        $elemMatch: {$and:filter}
      }
    })
  }
  const selectedByRole = _.uniq(selectedByInPerson.concat(selectedByZoom));
  const profId = [];
  const selectedByTopic =[];
  let topics = [];
  data.recruitingDepartment.forEach((dep)=>topics= topics.concat(dep.topics));
  selectedByRole.forEach((prof)=>{
    let profTopics = [];
    prof.recruitingDepartment.forEach((p)=>profTopics= profTopics.concat(p.topics));

    if(_.intersection(topics,profTopics).length>0){
      selectedByTopic.push(prof);
      profId.push(prof.professor)
    }
  })

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const professors = [];
  const emailsProfessor =[];
  profId.map(async(p)=>{
    const professor = await Professor.findById(p)
    professors.push(professor);
    emailsProfessor.push(professor.email)
  })
  const lectureDetails = await Lecturer.findById(data.lecturer);
  const stringTopics = topics.join(", ");

  const msg = {
    to: emailsProfessor, // Change to your recipient
    from: 'app.professor.match@gmail.com', // Change to your verified sender
    subject: 'New lecturer joined',
    html:`<h3>New lecturer has signed up matching your requirements</h3><br/><div>Name - ${lectureDetails.firstName} ${lectureDetails.lastName}</div><div>Email - ${lectureDetails.email}</div><div>Skills - ${stringTopics}</div>`
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  const emailMessage =[];
  professors.forEach((p,index)=>{
    let skillsA = []
   selectedByTopic[index].recruitingDepartment.forEach(g=>skillsA = skillsA.concat(g.topics))
    const newString = skillsA.join(", ")

    emailMessage.push(`<div>Name - ${p.firstName} ${p.lastName}</div><div>Email - ${p.email}</div><div>Skills looking for - ${newString}</div><br/><br/>`);
  });
  const stringEmailMessage = emailMessage.join('');
  const msg2 = {
    to: [lectureDetails.email], // Change to your recipient
    from: 'app.professor.match@gmail.com', // Change to your verified sender
    subject: 'Professors who are looking for your skills',
    html:`<h3>Professors who are looking for your skills</h3><br/>${stringEmailMessage}`
  }
  sgMail
    .send(msg2)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

};

module.exports = {

  saveUser: async (data) => {
    const salt = genSaltSync(10);  //hashing password to save the user
    data.password = hashSync(data.password, salt);
    const user = new Lecturer(data);
    const isExistP = await Professor.findOne({email: data.email});
    const isExistL = await Lecturer.findOne({email: data.email});
    if (isExistP || isExistL) {
      throw new Error("Email already exist");
      return;
    }
    const result = await user.save();
    return result;
  },


  updateLectureDetails: async (data) => {
    const isExist = await lecProfile.findOne({lecturer: data.lecturer});
    if (isExist) {
      await lecProfile.findOneAndUpdate({lecturer: data.id}, data);
    } else {
      await lecProfile.create(data);
    }
    await sendEmails(data)

  },
  getLecturerInfo: async (id) => {
    const lecInfo = await lecProfile.findOne({lecturer: id});
    return lecInfo;
  }
}