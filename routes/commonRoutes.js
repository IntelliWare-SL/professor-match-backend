const express = require("express");
const commonRouter = express.Router();
const auth = require("../middlewares/auth");
const commonController = require("../controller/commonController");

commonRouter.post("/",commonController.loginUser);

module.exports =commonRouter;