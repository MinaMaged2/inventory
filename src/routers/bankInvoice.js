const express = require("express");
const router = new express.Router();
const BankInvoice = require("../models/bankInvoice");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");
const Bank = require("../models/bank");

// add bankInvoice
router.post("/addBankInvoice", async (req, res) => {
  const description = req.body.description;
  const amount = req.body.amount;
  const operationDate = req.body.operationDate;
  const typeOfMove = req.body.typeOfMove;
  const bankId = req.body.bankId;

  try {
    if (!bankId || !description || !amount) {
      throw new Error("miss_data");
    }

    const bankInvoice = new BankInvoice({
      description,
      bankId,
      amount,
      operationDate,
      typeOfMove,
    });

    await bankInvoice.save();
    res.status(200).send({ bankInvoice });
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

module.exports = router;
