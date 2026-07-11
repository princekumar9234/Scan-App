const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function userRegiser(req, res) {
  const { username, email, password } = req.body;

  const checkUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (checkUser) {
    return res.status(409).json({ message: "user already exists" });
  }

  const hash = await bcrypt.hash(password, 10); //sequre our password

  const user = await userModel.create({
    username,
    password: hash,
    email,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRECT,
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {userRegiser}
