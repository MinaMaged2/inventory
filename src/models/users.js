const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("you cannot use the word password");
      }
    },
  },

  type: {
    type: String,
    required: true,
    trim: true,
  },

  token: {
    type: String,
  },
  userID: {
    type: Number,
    unique: true,
  },
  storeID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.token;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // const token = jwt.sign( {_id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: '1d' });
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.token = token;
  // const decoded = jwt.decode(token)
  // const expireAt = decoded.exp

  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (name, password) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error("the name or password is incorrect please try again");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("the name or password is incorrect please try again");
  }

  return user;
};

// hash the password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);

    console.log("password hashed");
  }

  next();
});
userSchema.plugin(AutoIncrement, { inc_field: "userID" });

const User = mongoose.model("User", userSchema);

module.exports = User;
