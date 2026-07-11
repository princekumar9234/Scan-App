const express = require("express");
const userController = require("../Controllers/user.controller");

const router = express.Router();

router.post("/register", userController.userRegiser);

module.exports = router;
