const Professor = require("../schemas/professor.schema");
const Lecturer = require("../schemas/lecturer.schema");
const Pprofile = require("../schemas/pprofile.schema");
const Lprofile = require("../schemas/lecProfile.schema");
const {compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
module.exports = {
  loginUser: async (data) => {
    let type;
     let user = await Professor.findOne({email: data.email});
     if (user){
       type = "professor"
     }
      if (!user){
        user = await Lecturer.findOne({email:data.email})
        if (user){
          type = "lecturer";
        }
      }
    if (user) {
      const result = compareSync(
        data.password,
        user.password
      );
      if (result) {
        const jsontoken = sign({result: user}, "secret", {
          expiresIn: "1day",
        });

        const {_id,firstName, lastName, email} = user
        let isProfileCompleted = false;
        if (type=="professor"){
          const complete = await Pprofile.findOne({professor:_id});
          if (complete){
            isProfileCompleted = true;
          }
        }else if (type=="lecturer"){
          const complete = await Lprofile.findOne({lecturer:_id});
          if(complete){
            isProfileCompleted = true;
          }
        }
        const loggedUser = {
          token: jsontoken,
          user: {_id,firstName, lastName, email, type,isProfileCompleted}
        };
        return loggedUser;

      } else {
        throw new Error("Invalid password");
      }
    } else {
      throw new Error("Invalid email");
    }
  }
}