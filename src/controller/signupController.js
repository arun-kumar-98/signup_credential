const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst = require("./constant");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { join } = require("@prisma/client/runtime");

const SignUp = async (req, res) => {
  try {
    //parse req.body data
    const userData = JSON.parse(JSON.stringify(req.body));
    console.log(userData);
    //regex pattern to match password
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!userData.password.match(regex)) {
      //send status
      res.status(404).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.pwd_pattern,
      });
    } else {
      //hash password
      userData.password = await bcrypt.hash(userData.password, 10);
      //generate sign up token
      userData.token = jsonwebtoken.sign(
        { name: userData.username, date: new Date() },
        "secretToken"
      );

      console.log("---------------------------> ", userData);
      // insert data
      const resp = await prisma.user.create({
        data: {
          userName: userData.userName,
          password: userData.password,
          token: userData.token,

          successor: {
            create: {
              userName: req.body.userName1,
              password: userData.password,
              token: userData.token,
            },
          },
        },
      });
      //get successor id
      console.log(resp.successorId);
      res.status(201).json({
        status: appConst.status.success,
        message: appConst.message.signup_success,
        response: resp,
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

updatePassword = async (req, res) => {
  try {
    //parse req.body data
    const userData = JSON.parse(JSON.stringify(req.body));
    //regex pattern to match password
    const regex =
      "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$";

    const isUser = await prisma.user.findFirst({
      where: { userName: userData.userName },
    });

    console.log(isUser);
    if (isUser) {
      const isMatched = await bcrypt.compare(
        userData.password,
        isUser.password
      );
      if (isMatched) {
        if (userData.changePassword.match(regex)) {
          const encryptedPwd = await bcrypt.hash(userData.changePassword, 10);
          await prisma.user.update({
            where: { userName: userData.userName },
            data: { password: encryptedPwd },
          });
        } else {
          res.status(400).json({
            status: appConst.status.fail,
            response: null,
            message: appConst.message.pwd_pattern,
          });
          return;
        }
      }
    } else {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.user_not_found,
      });
      return;
    }
  } catch (error) {
    res.status(400).json({});
  }
};

module.exports = { SignUp, updatePassword };
