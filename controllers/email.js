const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const logger = require("./logger");

dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.registration = email => {
  let mailOptions = {
    from: "milujemmail@gmail.com",
    to: email,
    subject: "Registration",
    text: "Your registration was successful"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.log("ERROR", "Error while sending registration e-mail", error);
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
