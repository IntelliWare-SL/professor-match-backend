const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.use("/lecturer", require("./lecturerRoutes"));

router.use("/professor", require("./professorRoutes"));

//router.use("/common",require("./commonRoutes"));

module.exports = router;
