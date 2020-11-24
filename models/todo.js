const { model, Schema } = require("mongoose");

const todo = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Todo", todo);
