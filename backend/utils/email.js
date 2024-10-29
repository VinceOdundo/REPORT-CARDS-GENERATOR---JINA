const sgMail = require("@sendgrid/mail");
const { config } = require("../config/env");

sgMail.setApiKey(config.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await sgMail.send({ to, from: "no-reply@reportcards.io", subject, text });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
