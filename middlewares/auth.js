const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  try {
    const verify = jwt.verify(
      req.headers.authorization.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    if (verify) {
      req.headers = verify;
      next();
    }
  } catch (err) {
    return res.json({ status: false, error: "Login token required!" });
  }
};

module.exports = authenticateUser;
