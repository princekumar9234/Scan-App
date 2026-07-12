const express = require("express");
const userController = require("../Controllers/user.controller");
// const validater = require("../middlewares/userValidate")

const router = express.Router();

router.post("/register", userController.userRegiser);
router.post("/login", userController.userLogin)

module.exports = router;
