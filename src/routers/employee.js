const express = require("express");
const router = new express.Router();
const Employee = require('../models/employee');
const auth = require("../middleware/auth");


// add employee
router.post("/addEmployee", async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const salary = req.body.salary;
  try {
    if (!name || !phone) {
      throw new Error("miss_data");
    }
    const employee = new Employee({ name, phone, salary });
    await employee.save();
    
    res.status(200).send({ employee });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "بيانات العميل غير مكتملة" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "العميل موجود بالفعل" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

// get all employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ name: 1 });
    res.status(200).send({ employees });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// edit employee
router.put("/employee/:id", async (req, res) => {
  const employeeID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "phone", "salary"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const employee = await Employee.findById(employeeID);

    if (!employee) {
      throw new Error("no_employee");
    }

    updates.forEach((update) => {
      employee[update] = req.body[update];
    });

    await employee.save();

    res.status(200).send({ employee });
  } catch (e) {
    console.log(e)
    if (e.code === 11000) {
      res.status(400).send({ message: "this employee name already exist" });
    } else if (e.message === "no_employee") {
      res.status(400).send({ message: "no employee with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// delete employee
router.delete("/employee/:id/", async (req, res) => {
  const employeeID = req.params.id;

  try {
    await Employee.findByIdAndDelete(employeeID);
    const employee = await Employee.find({}).sort({ name: 1 });
    res.status(200).send({ employee });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// delete employees
router.delete("/employees", async (req, res) => {
  const employeesToDelete = req.body.employees;
  console.log(employeesToDelete)
  try {
    for (let employee of employeesToDelete) {
      await Employee.findByIdAndDelete(employee._id);
    }
    const employees = await Employee.find({}).sort({ name: 1 });
    res.status(200).send({ employees });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;