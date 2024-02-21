const express = require("express");
const router = new express.Router();
const Supplier = require("../models/suppliers");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");

// add supplier
router.post("/addSupplier", async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const address = req.body.address;

  try {
    if (!name || !phone || !address) {
      throw new Error("miss_data");
    }

    const supplier = new Supplier({ name, phone, address });
    await supplier.save();
    let mainChartAccount = await MainChartAccount.findOne({
      accountName: "Suppliers",
    });
    let accountName = "م-" + supplier.supplierID;
    if (mainChartAccount) {
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: supplier._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    } else {
      mainChartAccount = new MainChartAccount({ accountName: "Suppliers" });
      await mainChartAccount.save();
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: supplier._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    }
    res.status(200).send({ supplier });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "this supplier name already exist" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all suppliers
router.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find({}).sort({ name: 1 });
    res.status(200).send({ suppliers });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get supplier
router.get("/supplier/:id", async (req, res) => {
  const supplierID = req.params.id;

  try {
    const supplier = await Supplier.findById(supplierID);

    if (!supplier) {
      throw new Error("no_supplier");
    }

    res.status(200).send({ supplier });
  } catch (e) {
    if (e.message === "no_supplier") {
      res.status(400).send({ message: "no supplier with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

router.get("/supplierAccount/:id", async (req, res) => {
  const supplierID = req.params.id;

  try {
    const chartAccount = await ChartAccount.findOne({
      accountRefId: supplierID
    });

    if (!chartAccount) {
      throw new Error("no_client");
    }

    res.status(200).send({ chartAccount });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(400).send({ message: "لا يوجد حساب لهذا المورد" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// edit supplier
router.put("/supplier/:id", async (req, res) => {
  const supplierID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "phone", "address"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const supplier = await Supplier.findById(supplierID);

    if (!supplier) {
      throw new Error("no_supplier");
    }

    updates.forEach((update) => {
      supplier[update] = req.body[update];
    });

    await supplier.save();

    res.status(200).send({ supplier });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "this supplier name already exist" });
    } else if (e.message === "no_supplier") {
      res.status(400).send({ message: "no supplier with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// delete supplier
router.delete("/supplier/:id", async (req, res) => {
  const supplierID = req.params.id;

  try {
    await Supplier.findByIdAndDelete(supplierID);
    const supplier = await Supplier.find({}).sort({ name: 1 });
    res.status(200).send({ supplier });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// delete suppliers
router.delete("/suppliers", async (req, res) => {
  const suppliersToDelete = req.body.suppliers;

  try {
    for (let supplier of suppliersToDelete) {
      await Supplier.findByIdAndDelete(supplier._id);
    }
    const suppliers = await Supplier.find({}).sort({ name: 1 });
    res.status(200).send({ suppliers });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;
