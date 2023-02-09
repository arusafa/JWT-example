const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

// send a GET request to /signup to render the signup form
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

// send a GET request to /logout to log out the user
router.get("/logout", authController.logout_get);

module.exports = router;
