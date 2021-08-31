const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Professor = require("../schemas/professor.schema");
const Lecturer = require("../schemas/lecturer.schema");
const proProfile = require("../schemas/pprofile.schema")
const lecProfile = require("../schemas/lecProfile.schema");
const sgMail = require('@sendgrid/mail')
const _ = require("lodash");

const sendEmails = async function (data) {
  const selectedByType = data.role.map(r => r.type);
  let inPersonAdj = [];
  let zoomAdj = [];
  let inPersonGuest = [];
  let zoomGuest = [];
  if (selectedByType.includes("Adjunct Professor")) {
    const inPerson = (data.role.filter((r) => r.type == "Adjunct Professor"))[0].inPerson;
    const zoom = (data.role.filter((r) => r.type == "Adjunct Professor"))[0].zoom;

    if (inPerson) {
      inPersonAdj = await lecProfile.find({$and: [{type: "Adjunct Professor"}, {inPerson: true}]});
      if (!inPersonAdj) {
        inPersonAdj = [];
      }

    }
    if (zoom) {
      zoomAdj = await lecProfile.find({$and: [{type: "Adjunct Professor"}, {zoom: true}]});
      if (!zoomAdj) {
        zoomAdj = [];
      }
    }

  }
  if (selectedByType.includes("Guest Lecturer")) {
    const inPerson = (data.role.filter((r) => r.type == "Guest Lecturer"))[0].inPerson;
    const zoom = (data.role.filter((r) => r.type == "Guest Lecturer"))[0].zoom;

    if (inPerson) {
      inPersonGuest = await lecProfile.find({$and: [{type: "Guest Lecturer"}, {inPerson: true}]});
      if (!inPersonGuest) {
        inPersonGuest = [];
      }
    }
    if (zoom) {
      zoomGuest = await lecProfile.find({$and: [{type: "Guest Lecturer"}, {zoom: true}]});
      if (!zoomGuest) {
        zoomGuest = [];
      }
    }
  }
  const selectedLecturer = _.uniq(inPersonAdj.concat(zoomAdj).concat(inPersonGuest).concat(zoomGuest));
  let topics = [];
  const selectedByTopic =[];
  const lecId =[]
  data.recruitingDepartment.forEach((dep)=>topics= topics.concat(dep.topics));
  selectedLecturer.forEach((lec)=>{
    let lecTopics = [];
    lec.recruitingDepartment.forEach((p)=>lecTopics= lecTopics.concat(p.topics));

    if(_.intersection(topics,lecTopics).length>0){
      selectedByTopic.push(lec);
      lecId.push(lec.lecturer)
    }
  })


  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const lecturers = [];
  const emailsLecturers =[];
  lecId.map(async(p)=>{
    const lecturer = await Lecturer.findById(p)
    lecturers.push(lecturer);
    emailsLecturers.push(lecturer.email)
  })
  const professorDetails = await Professor.findById(data.professor);
  const stringTopics = topics.join(", ");
  const msg = {
    to: emailsLecturers, // Change to your recipient
    from: 'app.professor.match@gmail.com', // Change to your verified sender
    subject: 'New Professor joined',
    html:`<h3>New Professor has signed up looking for your skills</h3><br/><div>Name - ${professorDetails.firstName} ${professorDetails.lastName}</div><div>Email - ${professorDetails.email}</div><div>Skill looking for - ${stringTopics}</div>`
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
  lecturers.forEach((p,index)=>{
    let skillsA = []
    selectedByTopic[index].recruitingDepartment.forEach(g=>skillsA = skillsA.concat(g.topics))
    const newString = skillsA.join(", ")

    emailMessage.push(`<div>Name - ${p.firstName} ${p.lastName}</div><div>Email - ${p.email}</div><div>Skills looking for - ${newString}</div><br/><br/>`);
  });
  const stringEmailMessage = emailMessage.join('');
  const msg2 = {
    to: [professorDetails.email], // Change to your recipient
    from: 'app.professor.match@gmail.com', // Change to your verified sender
    subject: 'Lecturers who matching for you requirements',
    html:`<h3>Lecturers who are macthing to your requirements </h3><br/>${stringEmailMessage}`
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
    const user = new Professor(data);
    const isExistP = await Professor.findOne({email: data.email});
    const isExistL = await Lecturer.findOne({email: data.email});
    if (isExistP || isExistL) {
      throw new Error("Email already exist");
      return;
    }
    const result = await user.save();
    return result;
  },
  updateProfessorDetails: async (data) => {
    const isExist = await proProfile.findOne({professor: data.professor});
    if (isExist) {
      await proProfile.findOneAndUpdate({professor: data.professor}, data);
    } else {
      await proProfile.create(data);
    }
    await sendEmails(data)

  },
  getProfessorInfo: async (id) => {
    const result = await proProfile.findOne({professor: id});
    return result;
  }
}