const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    // Almost done
    req.user = data;
  } catch {
    return res.sendStatus(403);
  }
  return next();
};

module.exports = auth;
