const express = require("express");
const userController = require("../Controllers/user.controller");
const validater = require("../middlewares/userValidate")

const router = express.Router();

router.post("/register",validater.validateUser, userController.userRegiser);
router.post("/login",validater.validateUser, userController.userLogin)

module.exports = router;
