const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.registration = (id, email) => {
  jwt.sign(
    {
      id: id
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: "1d"
    },
    (err, emailToken) => {
      const url = `http://localhost:3000/confirmation/?token=${emailToken}`;

      transporter.sendMail({
        to: email,
        subject: "Confirm Email",
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
      });

      if (err) {
        logger.log("ERROR", "Error while sending registration e-mail", error);
        console.log(err);
      } else {
        console.log("Email sent: " + email);
      }
    }
  );
};
