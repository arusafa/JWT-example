// importing the User model
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered ";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// creating maxAge for the cookie
const maxAge = 3 * 24 * 60 * 60;

// create json web token function
const createToken = (id) => {  //id is the user id (Payload in JWT)
  return jwt.sign({ id }, "net ninja secret", {  //net ninja secret is the secret key
    //returns secret key
    expiresIn: maxAge,  //expires in 3 days
  });
};

// signup view
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

// login view
module.exports.login_get = (req, res) => {
  res.render("login");
};

// database sign-up
module.exports.signup_post = async (req, res) => {
  // destructure the email and password from the request body
  const { email, password } = req.body;

  // create a new user in db
  try {
    const user = await User.create({ email, password });

    // create token (JWT) to signup error handling
    const token = createToken(user._id); //user._id is the id of the user(mongoDB)
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); //cookie name is jwt and token is the value and maxAge is 3days
    res.status(201).json({ user: user._id }); // for safety reasons, we don't want to send the user password to the client
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// database login
module.exports.login_post = async (req, res) => {
  // destructure the email and password from the request body
  const { email, password } = req.body;
  
  // create token (JWT) to login error handling
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id); //user._id is the id of the user(mongoDB)
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); //cookie name is jwt and token is the value and maxAge is 3days
    res.status(200).json({ user: user._id }); // for safety reasons, we don't want to send the user password to the client 
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// logout
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //set the cookie to an empty string and set the maxAge to 1ms to delete the cookie
  res.redirect("/");
}