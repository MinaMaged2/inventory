const express = require("express");
const router = new express.Router();
const Bank = require("../models/bank");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");


// add bank
router.post("/addBank", async (req, res) => {
  const name = req.body.name;

  try {
    if (!name) {
      throw new Error("miss_data");
    }

    const bank = new Bank({name});
    await bank.save();
    let mainChartAccount = await MainChartAccount.findOne({
      accountName: "Bank",
    });
    let accountName = "ب-" + bank.bankID;
    if (mainChartAccount) {
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: bank._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    } else {
      mainChartAccount = new MainChartAccount({ accountName: "Bank" });
      await mainChartAccount.save();
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: bank._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    }
    res.status(200).send({ bank });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "برجاء ادخال جميع البيانات المطلوبة" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "هذا البنك موجود بالفعل" });
    } else {
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});


// get all banks
router.get("/banks", async (req, res) => {
  try {
    const banks = await Bank.find({}).sort({ name: 1 });
    res.status(200).send({ banks });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء" });
  }
});


// get bank
router.get("/bank/:id", async (req, res) => {
  const bankID = req.params.id;

  try {
    const bank = await Bank.findById(bankID);

    if (!bank) {
      throw new Error("no_bank");
    }

    res.status(200).send({ bank });
  } catch (e) {
    if (e.message === "no_bank") {
      res.status(400).send({ message: "no bank with this ID" });
    } else {
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

router.get("/bankAccount/:id", async (req, res) => {
  const bankID = req.params.id;

  try {
    const chartAccount = await ChartAccount.findOne({
      accountRefId: bankID
    });

    if (!chartAccount) {
      throw new Error("no_account");
    }

    res.status(200).send({ chartAccount });
  } catch (e) {
    if (e.message === "no_account") {
      res.status(400).send({ message: "لا يوجد حساب لهذا البنك" });
    } else {
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

// edit bank
router.put("/bank/:id", async (req, res) => {
  const bankID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const bank = await Bank.findById(bankID);

    if (!bank) {
      throw new Error("no_bank");
    }

    updates.forEach((update) => {
      bank[update] = req.body[update];
    });

    await bank.save();

    res.status(200).send({ bank });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "هذا البنك موجود بالفعل" });
    } else if (e.message === "no_bank") {
      res.status(400).send({ message: "لا يوجد بنك بهذا الكود" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "تعديلات غير صحيحة" });
    } else {
      res.status(400).send({ message: "حدث خطء" });
    }
  }
});

// delete bank
router.delete("/bank/:id", async (req, res) => {
  const bankID = req.params.id;

  try {
    await Bank.findByIdAndDelete(bankID);
    const bank = await Bank.find({}).sort({ name: 1 });
    res.status(200).send({ bank });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء" });
  }
});

// delete banks
router.delete("/banks", async (req, res) => {
  const BanksToDelete = req.body.banks;

  try {
    for (let bank of BanksToDelete) {
      await Bank.findByIdAndDelete(bank._id);
    }
    const banks = await Bank.find({}).sort({ name: 1 });
    res.status(200).send({ banks });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "حدث خطء" });
  }
});

module.exports = router;