const controller = require("../controller/signupController");
const forgetController = require("../controller/forgetController");
const router = require("express").Router();


router.post("/signup", controller.SignUp);
router.post("/email", forgetController.getUser);
router.put('/update',forgetController.forgetPassword)
module.exports = router;
