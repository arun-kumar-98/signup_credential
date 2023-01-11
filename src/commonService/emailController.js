const nodemailer = require("nodemailer");

function mail(email, forgetToken) {
  
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "41c50562b882ee",
      pass: "53cac8aa1faeb7",
    },
  });
  let mailOptions = {
    from: "satyam7619patel@gmail.com",
    to: email,
    subject: "Welcome to Tectoro",
    text: "How are You ?",
    html: `<h2>Hi,</h2>
    <h4> please click the below link to resetpassword</h4>
    <a href="localhost:4000/signup/${forgetToken}">click below</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
      return err;
    }
    console.log("Mail Sent" + info.response);
    res.status(200).json({
      msg: "you recieve an email",
      info: info.messageId,
      preview: nodemailer,
    });
  });
}

module.exports = { mail };
