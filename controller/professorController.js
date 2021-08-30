const Joi = require("joi");
const { saveUser,updateProfessorDetails} = require("../services/professorService");


module.exports = {
  registerUser: async (req, res) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(25).required(),
      lastName: Joi.string(),
      type: Joi.string().default("professor")
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
  updateProfessor: async (req, res) => {
    const schema = Joi.object({
      schoolName: Joi.string().required(),
      college: Joi.string().required(),
      department: Joi.string().required(),
      campusLocation: Joi.string().required(),
      discipline: Joi.string().required(),
      role: Joi.array().items({
        type: Joi.string().required(), inPerson: Joi.boolean(),
        zoom: Joi.boolean()
      }).required(),
      recruitingDepartment: Joi.array().items({
        department: Joi.string().required(), topics: Joi.array().items().required()
      }).required().min(1),
    });

    const validation = schema.validate(req.body);
    if(validation.error){
      res.status(401).send({message: validation.error.message});
      return;
    }
    const body = validation.value;
    const id = req.params.id;
    body.professor = id;
    try{
      await updateProfessorDetails(body);
      res.status(201).send({success: 1});
    }catch(error){
      res.status(error.code || 401).send({message: error.message});
    }
  }
}