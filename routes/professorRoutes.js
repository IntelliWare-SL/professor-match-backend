const express = require("express");
const professorRouter = express.Router();
const auth = require("../middlewares/auth");
const professorController = require("../controller/professorController");

professorRouter.post("/register", professorController.registerUser);
professorRouter.patch("/editProfessor/:id",professorController.updateProfessor);

module.exports = professorRouter;
