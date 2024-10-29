require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

module.exports = { config };
