const User = require("../models/user");
const shortId = require("shortid");

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
