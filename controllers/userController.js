const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { email, firstName, middleName, lastName, role, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const checkUser = await User.find({ email });
    if (!checkUser.length > 0) {
      const user = await User.create({
        email,
        firstName,
        middleName,
        lastName,
        password: hashedPassword,
        role,
      });
      return res.json({
        status: true,
        message: "User successfully created!",
        user: {
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } else {
      return res.json({ status: false, error: "User already exists!" });
    }
  } catch (err) {
    return res.json({ status: false, error: err });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUser = await User.findOne({ email });
    const token = jwt.sign(
      {
        id: getUser._id,
        email: getUser.email,
        firstName: getUser.firstName,
        middleName: getUser.middleName,
        lastName: getUser.lastName,
        role: getUser.role,
      },
      process.env.JWT_SECRET
    );
    if (getUser) {
      if (await bcrypt.compare(password, getUser.password)) {
        return res.json({
          status: true,
          login: "success",
          token: `Bearer ${token}`,
        });
      } else {
        return res.json({ status: false, login: "Wrong Password!" });
      }
    } else {
      return res.json({ status: false, login: "No user found!" });
    }
  } catch (err) {
    return res.json({ status: false, error: "Wrong password or email" });
  }
};

const editUser = async (req, res) => {
  const currentPw = req.body.current_pw;
  const newPw = req.body.new_pw;
  const userId = req.headers.id;
  console.log("newPw", newPw);
  console.log("currentPw", currentPw);
  if (newPw !== "" && newPw !== undefined && newPw !== null) {
    if (currentPw == null || currentPw == undefined || currentPw == "") {
      return res
        .status(500)
        .json({ status: false, error: "Please enter current password!" });
    }
  }
  try {
    const userObj = {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
    };
    const user = await User.findOne({ _id: userId });
    if (currentPw !== null && currentPw !== undefined && currentPw !== "") {
      const comparePw = await bcrypt.compare(currentPw, user.password);
      console.log("compare", comparePw);
      if (comparePw && newPw !== undefined) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPw, salt);
        userObj["password"] = hashedPassword;
      } else if (!comparePw) {
        return res.status(500).json({
          status: false,
          error: "Wrong password, try with correct password again!",
        });
      }
    }

    const updated = await User.updateOne({ _id: userId }, userObj);
    return res
      .status(200)
      .json({ status: true, updated, message: "User record updated!" });
  } catch (err) {
    return res.status(500).json({ status: false, error: err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ status: true, users: users });
  } catch (err) {
    return res.json({ status: false, error: err });
  }
};

const getCurrentUser = async (req, res) => {
  const id = req.headers.id;
  try {
    const user = await User.findOne({ _id: id });
    console.log("current-user", user);
    return res.json({
      status: true,
      user: {
        id: user._id,
        first_name: user.firstName,
        middle_name: user.middleName,
        last_name: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.json({ status: false, error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
  editUser,
  getAllUsers,
  getCurrentUser,
};
