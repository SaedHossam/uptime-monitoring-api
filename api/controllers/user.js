const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { sendConfirmationMail } = require("../services/mailService");

exports.user_signup = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                // Send Email
                try {
                  sendConfirmationMail(user._id, user.email)
                    .then((r) => console.log('Email sent...', r))
                    .catch((error) => console.log('Error...', error.message));
                  res.status(201).json({
                    message: "User created"
                  });
                }
                catch (e) {
                  console.log(e);
                }
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (!user[0].emailConfirmed) {
        return res.status(401).json({
          message: "Email Not Confirmed!"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id
            },
            process.env.SECRET,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.user_confirm = (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    User.updateOne({ _id: decoded.id }, { emailConfirmed: true })
    .then(u => {
      return res.status(201).json({
        message: "Email Confirmed!",
        user: u
      });
    })
    .catch(e => {
      res.status(500).json({
        message: 'error while updating user!',
        e
      });
    });
  } catch (e) {
    res.status(500).json({
      message: 'error while updating user!',
      e
    });
  }

  
}