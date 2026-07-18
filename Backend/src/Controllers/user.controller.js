const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Production mein cross-domain cookies ke liye special options chahiye
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,                              // JS se access nahi hoga
  secure: isProduction,                        // Production = HTTPS only, Local = HTTP bhi chalega
  sameSite: isProduction ? "None" : "Lax",    // Production = cross-domain, Local = same-site
  maxAge: 7 * 24 * 60 * 60 * 1000,           // 7 din
};

async function userRegiser(req, res) {
  const { username, email, password } = req.body;

  const checkUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (checkUser) {
    return res.status(409).json({ message: "user already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    password: hash,
    email,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT);

  res.cookie("token", token, cookieOptions);

  return res.status(200).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function userLogin(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(401).json({ message: "invalid Crendential" }); // return add kiya
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Wrong Password!" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT);

  res.cookie("token", token, cookieOptions);

  return res.status(200).json({
    message: "User Login successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function userLogOut(req, res) {
  res.clearCookie("token", cookieOptions); // same options se clear karo
  return res.status(200).json({
    message: "User LogOut Successfully!",
  });
}

module.exports = { userRegiser, userLogin, userLogOut };
