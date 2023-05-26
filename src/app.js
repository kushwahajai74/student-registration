const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//databse connecion
const DBConnection = require("./databaseConnection");
const studentModel = require("./models/student-model");
dotenv.config();
DBConnection();

//for using static files
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
//for using ejs
app.set("view engine", "ejs");
app.use(express.json());

app.get("/login", (req, res) => {
  res.render("index");
});
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentModel.findOne({ email });
    if (student && (await bcrypt.compare(password, student.password))) {
      return res.status(200).send("Successfully logged in...");
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/signup", async (req, res) => {
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
      return res.status(409).send("User Already exist. Please Login");
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
    // const newStudent = await studentModel.create(data);
    return res.status(200).json({
      success: true,
      data: newStudent,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
