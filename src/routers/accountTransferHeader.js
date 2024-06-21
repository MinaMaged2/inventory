const express = require("express");
const router = new express.Router();
const AccountTransferHeader = require('../models/accountTransferHeader');
const ChartAccount = require('../models/chartAccounts');
const ChartAccountInvoices = require('../models/chartAccountsInvoices');
const DailyJournal = require('../models/dailyJournal');

router.post("/addAccountTransferHeader", async (req, res) => {
  const description = req.body.description;
  const amount = req.body.amount;
  const transferFrom = req.body.transferFrom;
  const transferTo = req.body.transferTo;

  // const transferFromName = req.body.transferFromName;
  // const transferToName = req.body.transferToName;

  try {
    if (!amount || !transferFrom || !transferTo) {
      throw new Error("miss_data");
    }

    const accountTransferHeader = new AccountTransferHeader({
      description,
      amount,
      transferFrom,
      transferTo
    });

    let chartAccountFrom = await ChartAccount.findById(transferFrom);
    let chartAccountTo = await ChartAccount.findById(transferTo);

    if(!chartAccountFrom || !chartAccountTo){
      throw new Error("no_account");
    }
    
    // let chartAccountInvoiceFrom = new ChartAccountInvoices({
    //   chartAccountID: chartAccountFrom,
    //   amount: amount,
    //   description: 'سحب من حساب ' + transferFromName,
    //   type: false
    // });

    // let chartAccountInvoiceTo = new ChartAccountInvoices({
    //   chartAccountID: chartAccountTo,
    //   amount: amount,
    //   description: 'اضافة الي حساب ' + transferToName,
    //   type: true
    // });

    await accountTransferHeader.save();
    res.status(200).send({ accountTransferHeader });
  } catch (e) {
    console.log(e.message);
    if (e.message === "no_account") {
      res.status(400).send({ message: "no account with this ID" });
    }else if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});



// get all transfer invoices
router.get("/accountTransferHeader", async (req, res) => {
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;

  try {
    const allTransfers = await AccountTransferHeader.find({
      createdAt: { $gte: startFrom, $lte: endTo }
    });
    res.status(200).send({ allTransfers });
  } catch (e) {
    res.status(400).send({ message: "حدث خطء ما" });
  }
});


module.exports = router;
