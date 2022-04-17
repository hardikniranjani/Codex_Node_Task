const express = require("express");
const router = express.Router();
const UserModel = require("../domain/user.demoain");
const verifyToken = require("../middleware/auth.middleware");
class userController {
  //signup email
  static async signUpEmail(req, res) {
    const userDomain = new UserModel();
    userDomain.signUpEmail(req, res);
  }
  // get user by id
  static async getAnUser(req, res) {
    const userDomain = new UserModel();
    userDomain.getAnUser(req, res);
  }
  //forgot password
  static async forgotPassword(req, res) {
    const userDomain = new UserModel();
    userDomain.forgotPasswordMail(req, res);
  }

  //Change password
  static async ChangePassword(req, res) {
    const userDomain = new UserModel();
    userDomain.changePassword(req, res);
  }
  // create User
  static async createAnUser(req, res) {
    const userDomain = new UserModel();
    userDomain.createUser(req, res);
  }
  // add preference in user
  static async addPreference(req, res) {
    const userDomain = new UserModel();
    userDomain.addPreference(req, res);
  }
}

// login user
router.post("/login", userController.getAnUser);

router.post("/signupEmail", userController.signUpEmail);

router.post("/forgotPassword", userController.forgotPassword);

// middleware
router.use(verifyToken);

// add preference in user
router.post("/addpreference", userController.addPreference);

// create User
router.post("/signup/:token", userController.createAnUser);

//changePassword
router.post("/changePassword/:token", userController.ChangePassword);

module.exports = router;
