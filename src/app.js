const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//databse connecion
const DBConnection = require("./databaseConnection");
// const studentModel = require("./models/student-model");
const studentRouter = require("../routes/student");
const adminRouter = require("../routes/admin");
dotenv.config();
DBConnection();

//for using static files
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
//for using ejs
app.set("view engine", "ejs");
app.use(express.json());

app.use("/student", studentRouter);
app.use("/admin", adminRouter);

app.get("*", (req, res) => {
  res.redirect("/student/login");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
