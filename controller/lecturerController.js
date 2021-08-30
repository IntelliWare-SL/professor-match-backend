const Joi = require("joi");
const { saveUser,getLecturerInfo, updateLectureDetails} = require("../services/lecturerService");
const sgMail = require('@sendgrid/mail')

module.exports = {

  registerUser: async (req, res) => {

    const schema = Joi.object({
      firstName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(25).required(),
      lastName: Joi.string(),
      type: Joi.string().default("lecturer")
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }

    const data = validation.value;
    try {
      const result = await saveUser(data);
      result.password = undefined;
      res.status(201).send({success: 1, result});
    } catch (error) {
      res.status(error.code || 409).send({message: error.message});
    }

  },
  editLecturer: async (req, res) => {
    const schema = Joi.object({
      type: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      aboutMe: Joi.string().required(),
      inPerson: Joi.boolean(),
      zoom: Joi.boolean(),
      education: Joi.array().items({
        level: Joi.string().allow(""), focus: Joi.string().allow(""),
        school: Joi.string().allow("")
      }),
      recruitingDepartment: Joi.array().items({
        department: Joi.string().required(), topics: Joi.array().items().required().min(1)
      }).required().min(1),
      socialMedia: Joi.array().items(),
      img:Joi.string()
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }
    const id = req.params.id;
    const body = validation.value;
    body.lecturer = id;
    try {
      await updateLectureDetails( body);
      res.status(201).send({success: 1});
    } catch (error) {
      res.status(error.code || 401).send({message: error.message});
    }
  },
  getInfo:async (req,res)=>{
    try{
      const id = req.user._id;
      const details = await getLecturerInfo(id);
      res.status(201).send({success: 1,user:req.user,details});
    }catch(error){
      res.status(error.code || 401).send({message: error.message});
    }
  }
}