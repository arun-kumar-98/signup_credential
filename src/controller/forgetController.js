const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst = require("./constant");
const jsonwebtoken = require("jsonwebtoken");

const { mail } = require("../commonService/emailController");

//getting user and send mail to reset password link
const getUser = async (req, res) => {
  try {
    let forgettToken;
    let email = req.body.userName;
    const respOne = await prisma.user.findFirst({
      where: {
        userName: email,
      },
    });
   //console.log(respOne.userName);
    if (!respOne.userName) {
      res.status(404).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.pwd_pattern,
      });
    } else {
      forgettToken = jsonwebtoken.sign(
        {
          name: respOne.userName,
          date: new Date(),
        },
        "secretToken",
        { expiresIn: "5m" }
      );
    }
    //set length of token
    let cutShort = () => {
      let token = forgettToken.slice(0, respOne.token.length);
      return token;
    };

    let token = cutShort();
    console.log("--------------------> ", forgettToken);
    const avx = await prisma.user
      .update({
        where: {
          userName: respOne.userName,
        },
        data: { forgetToken: token },
      })
      .then(console.log("success"));
    mail(email, token);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: appConst.status.fail,
      message: appConst.message.user_not_found,
    });
  }
};

//varifying token and updating the password
const forgetPassword = async (req, res) => {
  try {
    //parse req.body data
    const userData = req.body;

    //regex pattern to match password
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    //check user existance

    const isUser = await prisma.user.findFirst({
      where: { userName: userData.userName },
    });

    //if user existed

    if (isUser) {
      //compare token
      if (req.headers.token != isUser.forgetToken) {
        throw (error, console.log("Token mismatched!"));
      } else {
        //matching password pattern
        if (userData.newPassword.match(regex)) {
          const encryptedPwd = await bcrypt.hash(userData.newPassword, 10);
          console.log(encryptedPwd);
          const resp = await prisma.user.update({
            where: { userName: userData.userName },
            data: { password: encryptedPwd },
          });

          res.status(200).json({
            reponse: resp,
            mesg: appConst.message.pwd_successfully_changed,
          });

          //if password changed successfully then 
          //delete forgetToken from db 
          await prisma.user.update({
            where: { userName: userData.userName },
            data: { forgetToken: null },
          });
        } else {
          res.status(400).json({
            msg: appConst.message.pwd_pattern,
          });
        }
      }
    } else {
      res.status(400).json({
        mesg: appConst.message.user_not_found,
      });
    }
  } catch (error) {
    res.status(400).json({});
  }
};

module.exports = {
  getUser,
  forgetPassword,
};