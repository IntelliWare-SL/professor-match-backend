const express = require("express");
const lecturerRouter = express.Router();
const auth = require("../middlewares/auth");
const lecturerController = require("../controller/lecturerController");

lecturerRouter.post("/login",lecturerController.loginLecturer );
lecturerRouter.post("/register",lecturerController.registerUser);
lecturerRouter.patch("/editLecturer/:id",lecturerController.editLecturer);

module.exports = lecturerRouter;