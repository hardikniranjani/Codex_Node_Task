require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, userValidation } = require("../model/User.model");
const UserShoppingModel = require("../model/UserShopping.model");
const nodemailer = require("nodemailer");
const key = process.env.ACCESS_TOKEN_SECRET || 12345;
class UserDomain {
  // ENCRYPT PASSWORD
  async encripyPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return {
      password: await bcrypt.hash(password, salt),
    };
  }

  // token generator
  async generateToken(payload, expiryTime) {
    const token = jwt.sign({ ...payload }, key, {
      algorithm: "HS256",
      expiresIn: expiryTime,
    });
    return {
      token: token,
    };
  }

  // mail send function
  async sendMail(email, subject, htmlMessage, res, msg) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      from: process.env.GMAIL_USER,
    });
    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).send(err.message);

      return res.status(200).send(msg);
    });
  }

  // Email Verification
  async signUpEmail(req, res) {
    const email = req.body.Email;

    const findUser = await UserModel.findOne({ Email: email });

    if (findUser) return res.status(400).send("User already registered");

    const token = (await this.generateToken({ Email: email }, "15m")).token;

    let baseLink = "http://localhost:8080";
    let link = `${baseLink}/signup/${token}`;

    let subject = "Account signup verification";
    let htmlMessage = `<p>Hey, We have received a request to sing up on <a href=${baseLink}>Codex Shopping</a>, so if you have requested that, then please <a href=${link}>click here</a> to verify account</p>`;
    let msg = "We have sent you a Email to Verify account.";
    this.sendMail(email, subject, htmlMessage, res, msg);
  }

  // Create User (Register)
  async createUser(req, res) {
    var Data = req.body;

    const { error } = userValidation(Data);
    if (error) return res.status(500).send(error.details[0].message);

    const findUser = await UserModel.findOne({ Email: Data.Email });

    if (findUser) return res.status(400).send("User already registered");

    const newPassword = (await this.encripyPassword(Data.Password)).password;

    let userData = new UserModel({
      FullName: Data.FullName,
      Email: Data.Email,
      DateOfBirth: Data.DateOfBirth,
      Password: newPassword,
    });
    try {
      const NewUserData = await userData.save();
      const token = (
        await this.generateToken({ _id: NewUserData._id }, "3600m")
      ).token;
      res.header("x-access-token", token).send(NewUserData);
    } catch (err) {
      res.send(err.message);
    }
  }

  //get user ,login path
  async getAnUser(req, res) {
    const user = req.body;

    const findUser = await UserModel.findOne({
      Email: user.Email,
      IsActive: true,
    }).populate("UserShopping");

    if (!findUser)
      return res
        .status(404)
        .send("Sorry can not find you. Please check your email and try again");

    if (bcrypt.compareSync(user.Password, findUser.Password)) {
      const token = (await this.generateToken({ _id: findUser._id }, "3600m"))
        .token;

      res.header("x-access-token", token).send(findUser);
    } else {
      res.status(400).send("Invalid Email Or Password!!!");
    }
  }

  //forgot password email
  async forgotPasswordMail(req, res) {
    const email = req.body.Email;
    const findUser = await UserModel.findOne({ Email: email, IsActive: true });

    if (!findUser) return res.status(404).send("User not found!!!");

    const token = (await this.generateToken({ Email: email }, "15m")).token;

    let baseLink = "http://localhost:8080";
    const link = `${baseLink}/setpassword/${token}`;

    let subject = `Reset Your Password`;

    let htmlMessage = `<p>Hey, We have received a request to Reset a password on <a href=${baseLink}>Codex_Shoppping</a>, so if you have requested that, then please <a href=${link}>click here</a> to Reset your password</p>`;

    let msg = "We have sent a mail to Reset your Password";
    this.sendMail(email, subject, htmlMessage, res, msg);
  }

  //change password
  async changePassword(req, res) {
    let password = req.body.password;
    let hashedPassword = (await this.encripyPassword(password)).password;
    let userEmail = req.user.Email;

    await UserModel.findOne({
      Email: userEmail,
      IsActive: true,
    })
      .then(async (res) => {
        res.Password = hashedPassword;
        await res.save();
        return res;
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });

    res.status(200).send({
      msg: "Password Changed Successfully. Kindly do login again. You will be redirected to Login Page after 5 seconds.",
    });
  }

  // add preference in user
  async addPreference(req, res) {
    const user_id = req.user._id;
    const preference_id = req.query.preference_id;

    const getpreference = await UserShoppingModel.findById(preference_id);
    console.log("user id :- ", user_id);
    console.log("preference_id :- ", preference_id);
    if (!getpreference)
      return res.status(404).send(`preference id ${preference_id} not found`);

    const findUser = await UserModel.findById({ _id: user_id });
    console.log("User :-", findUser);
    if (!findUser)
      return res.status(404).send("Can't find user. Please login again");

    const addpreferenceToUser = await UserModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $addToSet: {
          UserShopping: preference_id,
        },
      },
      { new: true }
    ).populate("UserShopping");
    console.log("addpreferenceToUser", addpreferenceToUser);
    res.status(200).send(addpreferenceToUser);
  }
}

module.exports = UserDomain;
