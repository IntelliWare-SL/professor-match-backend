const express = require("express");
const professorRouter = express.Router();
const auth = require("../middlewares/auth");
import professorController from "../controller/professorController"

professorRouter.post("/register", professorController.registerUser);
professorRouter.post("/login", professorController.loginProfessor);
professorRouter.patch("/editProfessor/:id",professorController.updateProfessor);

module.exports = professorRouter;
