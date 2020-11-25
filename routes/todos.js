const { Router } = require("express");
const router = Router();
const Todo = require("../models/todo");
const redirect = require('../middleware/redirect');

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.todoID._doc, 
    name: c.name,
    description: c.description,
    image: c.image,
    id:  c.todoID,
  }))
}

router.get("/todos", redirect, async (req, res) => {
  const user = await req.user
  const todos = mapCartItems(user.cart)
  res.render("todos", {
    title: "Todos",
    isTodos: true,
    todos,
  });
}); 

router.get("/todos/:id/edit", redirect, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.render("todos-edit", {
    title: `Edit ${todo.name}`,
    todo,
  });
});

router.post("/todos/edit", redirect, async (req, res) => {
  await Todo.findByIdAndUpdate(req.body.id, req.body)
  await req.user.editCart(req.body)
  res.redirect("/todos");
});

router.delete('/todos/remove/:id', async (req, res) => {
  try {
    await req.user.removeFromCart(req.params.id)
    await Todo.deleteOne({ _id: req.params.id });
    const user = await req.user.populate('cart.items.todoID').execPopulate()
    const todos = mapCartItems(user.cart)
  const cart = {
    todos
  }
  res.status(200).json(cart)

  } catch (error) {
    console.log(error)
  }
 
});

module.exports = router;
