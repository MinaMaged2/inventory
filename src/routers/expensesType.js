const express = require("express");
const router = new express.Router();
const ExpensesType = require('../models/expensesType');
const auth = require("../middleware/auth");


// add expenseType
router.post("/addExpenseType", async (req, res) => {
  const name = req.body.name;

  try {
    if (!name) {
      throw new Error("miss_data");
    }
    const expenseType = new ExpensesType({ name });
    await expenseType.save();
    
    res.status(200).send({ expenseType });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "بيانات نوع الصرف غير مكتملة" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "نوع الصرف موجود بالفعل" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

// get all expenseType
router.get("/expenseTypes", async (req, res) => {
  try {
    const expenseTypes = await ExpensesType.find({}).sort({ name: 1 });
    res.status(200).send({ expenseTypes });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// edit expenseType
router.put("/expenseType/:id", async (req, res) => {
  const expenseTypeID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const expenseType = await ExpensesType.findById(expenseTypeID);

    if (!expenseType) {
      throw new Error("no_expenseType");
    }

    updates.forEach((update) => {
      expenseType[update] = req.body[update];
    });

    await expenseType.save();

    res.status(200).send({ expenseType });
  } catch (e) {
    console.log(e)
    if (e.code === 11000) {
      res.status(400).send({ message: "this expenseType name already exist" });
    } else if (e.message === "no_expenseType") {
      res.status(400).send({ message: "no expenseType with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// delete expenseType
router.delete("/expenseType/:id/", async (req, res) => {
  const expenseTypeID = req.params.id;

  try {
    await ExpensesType.findByIdAndDelete(expenseTypeID);
    const expenseType = await ExpensesType.find({}).sort({ name: 1 });
    res.status(200).send({ expenseType });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// delete expenseTypes
router.delete("/expenseTypes", async (req, res) => {
  const expenseTypesToDelete = req.body.expenseTypes;
  console.log(expenseTypesToDelete)
  try {
    for (let expenseType of expenseTypesToDelete) {
      await ExpensesType.findByIdAndDelete(expenseType._id);
    }
    const expenseTypes = await ExpensesType.find({}).sort({ name: 1 });
    res.status(200).send({ expenseTypes });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;