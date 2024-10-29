const jwt = require("jsonwebtoken");
const { config } = require("./env");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => jwt.verify(token, config.JWT_SECRET);

module.exports = { generateToken, verifyToken };
