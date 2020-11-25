const { model, Schema } = require("mongoose");

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String, 
    required: true,
  },
  avatarUrl: String,
  cart: {
    items: [
      {
        name: {
          type: Schema.Types.String,
          ref: "Todo",
        },

        description: {
          type: Schema.Types.String,
          ref: "Todo",
        },
        image: {
          type: Schema.Types.String,
          ref: "Todo",
        },
        todoID: {
          type: Schema.Types.ObjectId,
          ref: "Todo",
        },
      },
    ],
  },
});

user.methods.addToCart = function (todo) {
  let clonedItems = [...this.cart.items];
  clonedItems.push({ name:todo.name, description:todo.description, image:todo.image, todoID: todo._id });
  this.cart = { items: clonedItems };
  return this.save();
};

user.methods.editCart = function (todo) {
  let clonedItems = [...this.cart.items];
 
  const idx = clonedItems.findIndex(
    (c) => c.todoID.toString() === todo.id[0].toString()
  );

  let str = todo.id[0];
  
  const todoClone = {name:todo.name, description:todo.description, image:todo.image, todoID:str}
  clonedItems[idx] = todoClone;

 this.cart = { items: clonedItems}
 return this.save();
  
};

user.methods.removeFromCart = function (id) {
  let clonedItems = [...this.cart.items];
  clonedItems = clonedItems.filter(
    (c) => c.todoID.toString() !== id.toString()
  );
  this.cart = { items: clonedItems };
  return this.save();
};

module.exports = model("User", user);
