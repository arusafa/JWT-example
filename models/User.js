const mongoose = require("mongoose");

// bcrypt for password hashing
const bcrypt = require("bcrypt");

// validation import for email
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"], // to check if the email is valid
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); // generate a salt
  this.password = await bcrypt.hash(this.password, salt); // hash the password (this.password is the password from the request body)
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); // find the user with the email
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};




// create a model
const User = mongoose.model("user", userSchema);
module.exports = User;
