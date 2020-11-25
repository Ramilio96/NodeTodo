const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Auth",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const samePass = await bcrypt.compare(password, candidate.password);
      if (samePass) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Password not the same");
        res.redirect("/login#login");
      }
    } else {
      req.flash("loginError", "User not exist");
      res.redirect("/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash("registerError", "User with this email already exists");
      res.redirect("/login#register");
    } else {
      const hashPass = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPass,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
