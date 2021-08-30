const Joi = require("joi");
const {loginProfessor, saveUser,updateProfessorDetails} = require("../services/professorService");
///Joi is used for do the validation
///this is where all the request and responses handling happens.


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
  loginProfessor: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(25).required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }
    const body = validation.value;
    try {

      const {user, token} = await loginProfessor(body);

      return res.status(200).json({
        success: 1,
        message: "login Sucess",
        token, user
      });

    } catch (error) {
      res.status(error.code || 401).send({message: error.message});
    }
  },
  updateProfessor: async (req, res) => {
    const schema = Joi.object({
      schoolName: Joi.string().allow(""),
      college: Joi.string().allow(""),
      department: Joi.string().allow(""),
      campusLocation: Joi.string().allow(""),
      discipline: Joi.string().allow(""),
      role: Joi.array().items({
        type: Joi.string(), inPerson: Joi.boolean(),
        zoom: Joi.boolean()
      }),
      recruitingDepartment: Joi.array().items({
        department: Joi.string(),
        topics: Joi.array().items(Joi.string())
      })
    });

    const validation = schema.validate(req.body);
    if(validation.error){
      res.status(401).send({message: validation.error.message});
      return;
    }
    const body = validation.value;
    const id = req.params.id;
    try{
      await updateProfessorDetails(id,body);
    }catch(error){
      res.status(error.code || 401).send({message: error.message});
    }
  }
}