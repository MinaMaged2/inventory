const express = require("express");
const router = new express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");

router.post("/Auth/CreateUser", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const type = req.body.type;

  if (!name || !password || !type) {
    throw new Error("missing_data");
  }
  const user = new User({ name, password, type });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "المستخدم موجود من قبل" });
    } else if (e.message === "missing_data") {
      res.status(400).send({ message: "برجاء ادخال جميع البيانات المطلوبة" });
    } else {
      console.log(e);
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

router.post("/Auth/Login", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  if (!name || !password) {
    throw new Error("missing_data");
  }

  try {
    const user = await User.findByCredentials(req.body.name, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    if (e.message === "missing_data") {
      res.status(400).send({ message: "برجاء ادخال جميع البيانات المطلوبة" });
    } else {
      console.log(e);
      res.status(400).send({ message: "الاسم او كلمة السر خطء" });
    }
  }
});

router.put("/Auth/UpdateUser", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "type"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdates) {
    throw new Error("Invalid_updates");
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send({user: req.user,token: req.token });
  } catch (e) {
    if (e.message === "Invalid_updates") {
      res.status(400).send({ message: "تعديلات غير صحيحة" });
    } else {
      console.log(e);
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

router.put("/Auth/EditUser/:id", auth, async (req, res) => {
  const userID = req.params.id
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "type"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdates) {
    throw new Error("Invalid_updates");
  }
  try {

    const user = await User.findById(userID);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(user);
  } catch (e) {
    if (e.message === "Invalid_updates") {
      res.status(400).send({ message: "تعديلات غير صحيحة" });
    } else {
      console.log(e);
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

router.post("/Auth/Logout", auth ,async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "حدث خطء" });
  }
});

// get all users
router.get("/Auth/Users",  async (req, res) => {
  try {
    const users = await User.find({ type: { $ne: "admin" } }).sort({ name: 1 });
    res.status(200).send({ users });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء" });
  }
});

// delete supplier
router.delete("/Auth/User/:id", async (req, res) => {
  const userID = req.params.id;

  try {
    await User.findByIdAndDelete(userID);
    const users = await User.find({});
    res.status(200).send({ users });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;
