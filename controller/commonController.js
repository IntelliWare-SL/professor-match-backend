const Joi = require("joi");
const {loginUser} = require("../services/commonService");
module .exports = {
  loginUser :async (req,res)=>{
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
      const {user, token} = await loginUser(body);
      return res.status(200).json({
        success: 1,
        message: "login Sucess",
        token, user
      });

    } catch (error) {
      res.status(error.code || 401).send({message: error.message});
    }
  }
}