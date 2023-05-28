const jwt = require("jsonwebtoken");
const studentModel = require("../src/models/student-model");

const auth = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    // Almost done
    req.user = data;
    const email = data.email;
    // console.log(_id);
    const student = await studentModel.findOne({ email });
    if (!student.admin) return res.redirect("/student/login");
  } catch {
    return res.sendStatus(403);
  }
  return next();
};

module.exports = auth;
