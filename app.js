const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const { requireAuth,checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://fall2022_comp3123:SAFA.aru1993@cluster0.lclqo7i.mongodb.net/AUTH?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000), console.log("connected to db"))
  .catch((err) => console.log(err));

// routes
// applying checkUser middleware to all routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));  //requireAuth is the middleware , it will check if the user is logged in or not
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');  //newUser is the name of the cookie
  res.cookie("newUser", false); //newUser is the name of the cookie and false is the value
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  //maxAge(cookie=>called Session(as default)),
  //httpOnly: true Httponly cookies are inaccessible to JavaScript's Document.cookie API; they are only sent to the server.
  res.send("you got the cookies!"); //send the response
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
