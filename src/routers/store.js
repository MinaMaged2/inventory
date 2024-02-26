const express = require("express");
const router = new express.Router();
const Store = require("../models/store");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");

// add store
router.post("/addStore", async (req, res) => {
  const name = req.body.name;

  try {
    if (!name) {
      throw new Error("miss_data");
    }

    const store = new Store({ name });
    await store.save();

    let mainChartAccount = await MainChartAccount.findOne({
      accountName: "Stores",
    });
    let accountName = "خ-" + store.storeID;
    if (mainChartAccount) {
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: store._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        treasury: {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        dailyExpenses:{
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    } else {
      mainChartAccount = new MainChartAccount({ accountName: "Stores" });
      await mainChartAccount.save();
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: store._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        treasury: {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        dailyExpenses:{
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        },
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    }
    res.status(200).send({ store });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "بيانات المخزن غير مكتملة" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "هذا المخزن موجود بالفعل" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

// get stores
router.get("/stores", async (req, res) => {
  try {
    const stores = await Store.find({}).sort({ name: 1 });
    res.status(200).send({ stores });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء ما" });
  }
});

// delete store
router.delete("/store/:id", async (req, res) => {
  const storeID = req.params.id;

  try {
    await Store.findByIdAndDelete(storeID);
    const stores = await Store.find({}).sort({ name: 1 });
    res.status(200).send({ stores });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء ما" });
  }
});

// delete stores
router.delete("/stores", async (req, res) => {
  const storesToDelete = req.body.stores;

  try {
    for (let store of storesToDelete) {
      await Store.findByIdAndDelete(store._id);
    }
    const stores = await Store.find({}).sort({ name: 1 });
    res.status(200).send({ stores });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "حدث خطء ما" });
  }
});

// edit store
router.put("/store/:id", async (req, res) => {
  const storeID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const store = await Store.findById(storeID);

    if (!store) {
      throw new Error("no_store");
    }

    updates.forEach((update) => {
      store[update] = req.body[update];
    });

    await store.save();

    res.status(200).send({ store });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "هذا المخزن موجود بالفعل" });
    } else if (e.message === "no_store") {
      res.status(400).send({ message: "no store with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "تعديلات غير صحيحة" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

module.exports = router;
