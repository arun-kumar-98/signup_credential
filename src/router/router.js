const controller = require("../controller/signupController");
const forgetController = require("../controller/forgetController");
const router = require("express").Router();
const access = require("../controller/email");

router.post("/signup", controller.SignUp);
router.post("/email", forgetController.getUser);
router.post("/send", access.api);
router.put('/update',forgetController.forgetPassword)
module.exports = router;
