const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Lecturer = require("../schemas/lecturer.schema");
const moment = require("moment");


module.exports = {
    saveUser: async (data) => {
        const salt = genSaltSync(10);  //hashing password to save the user
        data.password = hashSync(data.password, salt);
        const user = new Lecturer(data);
        const isExist = await Lecturer.findOne({email: data.email});
        if (isExist) {
            throw new Error("Email already exist");
            return;
        }
        const result = await user.save();
        return result;
    },
    loginLecturer: async (data) => {
        const user = await Lecturer.findOne({email: data.email});
        if (user) {
            const result = compareSync(
              data.password,
              user.password
            );
            if (result) {
                const jsontoken = sign({result: user}, "secret", {
                    expiresIn: "1day",
                });
                const {_id, firstName,lastName, email} = user
                const loggedUser = {
                    token: jsontoken,
                    user: {_id, firstName,lastName, email, type:"lecturer"}
                };
                return loggedUser;

            } else {
                throw new Error("Invalid password");
            }
        } else {
            throw new Error("Invalid email");
        }

    },
    updateLectureDetails:async(id,data)=>{
       await Lecturer.findByIdAndUpdate(id,data);
    }
}