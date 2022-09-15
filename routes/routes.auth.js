const router = require("express").Router();
const controller = require("../controller/controller.auth.js");
const middleware = require("../middlewares/middleware.auth");

//  Get Request
router.get("/logout", middleware.verifyToken, controller.logout);
router.get("/sendOTP", middleware.verifyToken, controller.sendOTP);

// Post Request
router.post("/register", controller.register);
router.post("/login", controller.login);

router.post("/verifyOTP", middleware.verifyToken, controller.verifyOTP);
router.post("/reset", middleware.verifyToken, controller.resetPassword);

router.post("/forget", controller.forgetPassword);

router.all("*", (req, res) => res.status(404).send("404 | Page Not Found..."));

module.exports = router;
