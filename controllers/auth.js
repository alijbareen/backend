const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: "Email is taken" });
    }
  });

  const { name, email, password } = req.body;
  let username = shortId.generate();
  let profile = `${process.env.CLIENT_URL}/profile/${username}`;
  let newUSer = new User({ name, email, password, profile, username });
  newUSer.save((err, success) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    // res.json({ user: success });
    // });
    res.json({ message: "Signup success! You Sign in" });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //check if email exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User dosen't exist , Please signUp first" });
    }
    //authntecate
    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ error: "cannot signin , check mail and pass" });
    }
    //generate a token and to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { _id, username, email, role } = user;
    return res.json({ token, user });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout Success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["RS256"],
});
