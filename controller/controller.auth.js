const { db } = require("../models/models.user");
const jwt = require("jsonwebtoken");
const User = require("../models/models.user");
const bcrypt = require("bcrypt");
const mailer = require("nodemailer");

const auth = {};
// Setting UNIQUE Attribute for 'email' field...
db.collection("User").createIndex({ email: 1 }, { unique: true });

// SIGNUP A User
auth.register = async (req, res) => {
  try {
    //   Hash Password from the User
    req.body.jwt = jwt.sign(
      { email: req.body.email },
      process.env.JWT_SECRET_KEY
    );
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new User(req.body);
    //  Insert in the DB
    await db.collection("User").insertOne(user);
    res.status(200).send(`User ${user.username} successfully registered!!!`);
  } catch (err) {
    res.status(500).json(err);
  }
};

// LOGIN A User
auth.login = async (req, res) => {
  try {
    //  Find the User
    const user = await db.collection("User").findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User Not Found!!!");
    //  Check for password
    // const _id = user._id.valueOf();
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      const token = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET_KEY
      );
      await db
        .collection("User")
        .updateOne({ _id: user._id }, { $set: { jwt: token } });
      return res.status(200).send(`Successful Login with ${token} as token`);
    }
    res.status(400).send("Wrong Password");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// LOGOUT A User
auth.logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await db
      .collection("User")
      .findOne({ email: verifiedToken.email });
    if (!user) return res.status(403).send("Invalid Token");
    await db
      .collection("User")
      .updateOne({ _id: user._id }, { $set: { jwt: null } });
    return res.status(200).send(`Successfully logged Out!!!`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Account Verification for A User --> Send OTP
auth.sendOTP = async (req, res) => {
  try {
    // Generate OTP
    const generateOTP = () => {
      let numbers = "0123456789";
      let OTP = "";
      for (let i = 0; i < 4; i++) {
        OTP += numbers[Math.floor(Math.random() * 10)];
      }
      return OTP;
    };

    const OTP = generateOTP();
    const transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: req.body.Email,
      subject: "OTP to verify your Account....",
      text: `Your OTP is : ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      else console.log("Email sent: " + info.response);
    });

    await db
      .collection("User")
      .updateOne({ _id: req.body.UserID }, { $set: { OTP } });
    res.status(200).send("PLEASE check your Email and Verify your ACCOUNT");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Account Verification for A User --> Verify  OTP
auth.verifyOTP = async (req, res) => {
  try {
    const data = await db.collection("User").findOne({ _id: req.body.UserID });
    if (!data) return res.status(400).send("Otp Not Found.");
    if (req.body.OTP == data.OTP) {
      await db
        .collection("User")
        .updateOne(
          { _id: req.body.UserID },
          { $set: { OTP: null, isVerified: true } }
        );
      return res.status(200).send("Account was successfully Verified....");
    }
    return res.status(403).send("Wrong OTP , Please try AGAIN!!!!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Reset Password for A User
auth.resetPassword = async (req, res) => {
  try {
    const user = await db.collection("User").findOne({ _id: req.body.UserID });
    console.log(user + "bjnjc");
    const result = await bcrypt.compare(req.body.password, user.password);
    console.log(result + "  njnxjnj");
    if (result) {
      if (req.body.newPassword === req.body.confirmPassword) {
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10);
        await db
          .collection("User")
          .updateOne(
            { _id: req.body.UserID },
            { $set: { password: req.body.newPassword } }
          );
        return res.status(200).send("successfully reset password");
      }
      return res.status(400).send("Passwords DON'T Match....");
    }
    return res.status(403).send("Wrong Password");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Forget Password for A User
auth.forgetPassword = async (req, res) => {
  // req.body.Email was passed in body --> ONLY for Testing Purpose
  if (req.body.newPassword === req.body.confirmPassword) {
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await db
      .collection("User")
      .updateOne(
        { email: req.body.Email },
        { $set: { password: req.body.newPassword } }
      );
    return res.status(200).send("successfully changed password");
  }
  return res.status(400).send("Passwords DON'T Match....");
};

module.exports = auth;
