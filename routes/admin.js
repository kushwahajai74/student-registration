const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  displayAdminLogin,
  adminLogin,
  displayDashboard,
} = require("../controllers/adminController");
const router = express.Router();
router.get("/", displayAdminLogin);
router.get("/dashboard", adminAuth, displayDashboard);
router.post("/", adminLogin);
module.exports = router;
