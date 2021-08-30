const express = require("express");
const lecturerRouter = express.Router();
const auth = require("../middlewares/auth");
const lecturerController = require("../controller/lecturerController");



lecturerRouter.post("/register",lecturerController.registerUser);
lecturerRouter.patch("/editLecturer/:id",lecturerController.editLecturer);
// lecturerRouter.get("/me",)

module.exports = lecturerRouter;
