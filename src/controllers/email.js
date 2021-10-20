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

exports.registration = (uid, email) => {
  jwt.sign(
    {
      id: uid
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: "1d"
    },
    (err, emailToken) => {
      if (err) {
        console.log(error);
        logger.log("ERROR", "Error during JWT Sign (Registration email)", error);
      }
      let url = `http://localhost:3000/confirmation/?token=${emailToken}`;
      let mailOptions = {
        to: email,
        subject: "Confirm Email",
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (err) {
          console.log(err);
          logger.log("ERROR", "Error while sending registration e-mail", error);
        } else {
          console.log("Email sent: " + email + " | " + info.response);
        }
      });
    }
  );
};
