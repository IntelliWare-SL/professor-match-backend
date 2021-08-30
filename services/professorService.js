const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Professor = require("../schemas/professor.schema");
const Lecturer = require("../schemas/lecturer.schema");
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
    loginProfessor: async (data) => {
        const user = await Professor.findOne({email: data.email});
        if (user) {
            const result = compareSync(
                data.password,
                user.password
            );
            if (result) {
                const jsontoken = sign({result: user}, "secret", {
                    expiresIn: "1day",
                });
                const {_id, lastName, email} = user
                const loggedUser = {
                    token: jsontoken,
                    user: {_id, lastName, email, type:"Professor"}
                };
                return loggedUser;

            } else {
                throw new Error("Invalid password");
            }
        } else {
            throw new Error("Invalid email");
        }

    },
    updateProfessorDetails:async(id,data)=>{
        await Professor.findByIdAndUpdate(id,data);
    }
}