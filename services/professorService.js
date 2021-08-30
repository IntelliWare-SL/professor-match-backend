const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Professor = require("../schemas/professor.schema");
const Lecturer = require("../schemas/lecturer.schema");
const proProfile = require("../schemas/pprofile.schema")
const moment = require("moment");


module.exports = {
    saveUser: async (data) => {
        const salt = genSaltSync(10);  //hashing password to save the user
        data.password = hashSync(data.password, salt);
        const user = new Professor(data);
        const isExistP = await Professor.findOne({email: data.email});
        const isExistL = await Lecturer.findOne({email:data.email});
        if (isExistP || isExistL) {
            throw new Error("Email already exist");
            return;
        }
        const result = await user.save();
        return result;
    },
    updateProfessorDetails:async(data)=>{
        const isExist = await proProfile.findOne({professor:data.professor});
        if(isExist){
            await proProfile.findOneAndUpdate({professor:data.professor},data);
        }
        else{
            await proProfile.create(data);
        }

    }
}