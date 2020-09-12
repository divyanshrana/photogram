const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const hbs = require("nodemailer-express-handlebars");
const nodemailMailgun = require("nodemailer-mailgun-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// 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

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({ error: "Please add ALL fields" }); //return if error
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "Email already exists" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email, //as email: email are same so we can write like this
          name,
          password: hashedpassword,
          pic,
        });
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "photogrammerx@gmail.com",
              subject: "Welcome to PhotoGram !",
              html: `<div><h2>Hi ${user.name}, Welcome to PhotoGram !</h2><span>“There is one thing the photograph must contain, the humanity of the moment.”
                — Robert Frank</span><br/><br/><a href="https://graminstaclone.herokuapp.com/" target="_blank">
                <button style="font-size:18px;color:white;background:#1E88E5;padding:10px 15px;border-radius:7px;border:0px">Get started</button></a> </div>`,
            });
            res.json({ message: "Signed Up!" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter all credentials" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //res.json({ message: "Successfully signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("Error", error);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ Error: "Email not registered, Please register." });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600 * 1000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "photogrammerx@gmail.com",
          subject: "reset-password",
          html: `
          <p>Click the link below to reset your password</p><br />
          <h5><a href="https://graminstaclone.herokuapp.com/reset/${token}">Reset</a></h5>
          `,
        });
        res.json({ message: "Check your registered mail for reset link." });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Session expired!" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.expireToken = undefined;
        user.resetToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password changed succesfully" });
        });
      });
      transporter.sendMail({
        to: user.email,
        from: "photogrammerx@gmail.com",
        subject: "Alert !",
        html: `<h2>Your password was Changed on ${Date(
          Date.now()
        ).toString()}</h2>`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
