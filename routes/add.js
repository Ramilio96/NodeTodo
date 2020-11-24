const { Router } = require("express");
const router = Router();
const Todo = require("../models/todo");
const redirect = require('../middleware/redirect');

router.get("/add", redirect, (req, res) => {
  res.render("add", {
    title: "Add",
    isReg: true,
  });
});

router.post("/add", redirect, async (req, res) => {
  const { name, description, image } = req.body;
  const todo = new Todo({ name, description, image, userID: req.user });
  try {
    await req.user.addToCart(todo)
    await todo.save();
    res.redirect('/todos')
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
