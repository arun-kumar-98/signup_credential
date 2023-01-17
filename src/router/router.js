const controller = require("../controller/signupController");
const forgetController = require("../controller/forgetController");
const router = require("express").Router();

router.post("/signup", controller.SignUp);
router.post("/email", forgetController.getUser);
router.put("/update", forgetController.forgetPassword);
router.post("/fetch", forgetController.records);
router.post("/getMany", forgetController.findsMany);
router.put("/updateOne", forgetController.updateSingleRecords);
router.delete("/delete", forgetController.deleteOne);
module.exports = router;
