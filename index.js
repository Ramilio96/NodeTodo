const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const homeRoute = require("./routes/home");
const addRoute = require("./routes/add");
const todosRoute = require("./routes/todos");
const authRoute = require("./routes/auth");
const profileRoute = require('./routes/profile');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authMiddleware = require("./middleware/auhentication");
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file')
const bodyParser = require('body-parser')
const Handlebars = require('handlebars');
const flash = require('connect-flash');
const compression = require('compression');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const MONGO_URI =
"mongodb+srv://Ramil:lChygcgRKEovfP5d@cluster0.r0e1l.mongodb.net/nodeTodo?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'mySessions'
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(flash())
app.use(authMiddleware);
app.use(userMiddleware);
app.use(fileMiddleware.single('avatar'));

app.use(homeRoute);
app.use(addRoute);
app.use(todosRoute);
app.use(authRoute);
app.use(profileRoute);

app.use(express.static(path.join(__dirname, "public")));
app.use('/avatar',express.static(path.join(__dirname,"avatar")))
app.use(express.urlencoded({ extended: true }));

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify:false
    },() => {
      console.log("MongoDB connected");
    });

    app.listen(port);
  } catch (error) {
    console.log(error);
  }
}

start();
