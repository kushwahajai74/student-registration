const express = require("express");
const studentSchema = require("../src/models/student-model");
const router = express.Router();
const {
  displayLogin,
  displayRegister,
  studentRegister,
  studentLogin,
  displayInfo,
  studentLogout,
} = require("../controllers/studentController");
const auth = require("../middleware/auth");

router.get("/login", displayLogin);
router.get("/register", displayRegister);
router.get("/info", auth, displayInfo);
router.get("/logout", auth, studentLogout);
router.post("/login", studentLogin);
router.post("/register", studentRegister);

module.exports = router;
