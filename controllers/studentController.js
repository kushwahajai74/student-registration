const studentModel = require("../src/models/student-model");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
// parse application/json
app.use(bodyParser.json());

//for using ejs

exports.displayLogin = (req, res) => {
  res.render("index");
};
exports.displayRegister = (req, res) => {
  res.render("signup");
};
exports.displayInfo = async (req, res) => {
  const email = req.user.email;
  const student = await studentModel.findOne({ email });
  const name = student.first_name + "   " + student.last_name;
  const enrollment = student.enrollment;
  const phone = student.phone;
  const branch = student.branch;
  const sex = student.sex;
  const status = student.status;

  res.render("info", { name, enrollment, phone, branch, sex, status, email });
};
exports.studentRegister = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      enrollment,
      branch,
      sex,
    } = req.body;

    const oldUser = await studentModel.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .send(
          "<h3>User Already exist. Please <a href=/student/login>Login</a></h3>"
        );
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const newStudent = await studentModel.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      phone,
      enrollment,
      branch,
      sex,
    });
    // const token = jwt.sign(
    //   { user_id: newStudent._id, email },
    //   process.env.TOKEN_KEY,
    //   {
    //     expiresIn: "5m",
    //   }
    // );
    // //storing jwt
    // res.cookie("access_token", token, {
    //   httpOnly: true,
    // });
    //sending registration email

    const userEmail = newStudent.email;

    let config = {
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Student Information Centre",
        link: "https://mailgen.js/",
      },
    });

    var emailBody = {
      body: {
        name: newStudent.first_name,
        intro:
          "Welcome to Student Registration Centre We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    let mail = MailGenerator.generate(emailBody);

    let message = {
      from: EMAIL,
      to: userEmail,
      subject: "Account Registered Successfully",
      html: mail,
    };

    transporter.sendMail(message);

    return res
      .status(200)
      .send("<h3>User registerd please <a href=/student/login>Login</a></h3>");
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentModel.findOne({ email });
    if (student && (await bcrypt.compare(password, student.password))) {
      const token = jwt.sign(
        { user_id: student._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      if (student.status === false) {
        return res
          .status(400)
          .send(
            "<h3>You have not approved by admin yet...<a href=/student/logout>Logout</a></h3>"
          );
      }

      res.cookie("access_token", token, {
        httpOnly: true,
      });
      return res.redirect("/student/info");
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.studentLogout = async (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
};
