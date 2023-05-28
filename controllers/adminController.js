const studentModel = require("../src/models/student-model");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

exports.displayAdminLogin = (req, res) => {
  res.render("adminLogin");
};
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentModel.findOne({ email });
    if (
      student &&
      (await bcrypt.compare(password, student.password)) &&
      student.admin
    ) {
      const token = jwt.sign(
        { user_id: student._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      return res.redirect("/admin/dashboard");
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.displayDashboard = async (req, res) => {
  try {
    const student = await studentModel.find({});
    res.render("dashboard", { student });
  } catch (error) {
    res.send(500).send(error);
  }
};
