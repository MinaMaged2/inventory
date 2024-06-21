const express = require("express");
const router = new express.Router();
const ChartAccount = require("../models/chartAccounts");
const MainChartAccount = require("../models/mainChartAccount");
const Client = require("../models/clients");
const Supplier = require("../models/suppliers");
const Store = require("../models/store");
const ChartAccountInvoices = require("../models/chartAccountsInvoices");
const Bank = require("../models/bank");
const DailyJournal = require("../models/dailyJournal");

// get all chartAccounts
router.get("/chartAccounts", async (req, res) => {
  try {
    const chartAccount = await ChartAccount.find({});
    res.status(200).send({ chartAccount });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all store chartAccounts
router.get("/chartAccountsOfParent", async (req, res) => {
  const chartType = req.query.chartType;

  try {
    const mainChartAccount = await MainChartAccount.findOne({
      accountName: chartType,
    });

    if (mainChartAccount) {
      const chartAccounts = await ChartAccount.find({
        parentChartAccountID: mainChartAccount._id,
      });
      res.status(200).send({ chartAccounts });
    } else {
      res.status(200).send({ chartAccounts: [] });
    }
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all store chartAccounts
router.get("/singleChartAccount/:id", async (req, res) => {
  const chartID = req.params.id;
  try {
    const chartAccount = await ChartAccount.findOne({
      accountRefId: chartID,
    });
    res.status(200).send({ chartAccount });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all  account populated
router.get("/populatedAccountsData", async (req, res) => {
  const chartType = req.query.chartType;
  try {
    const mainChartAccount = await MainChartAccount.findOne({
      accountName: chartType,
    });

    if (mainChartAccount) {
      let chartAccounts;

      if (chartType === "Customers") {
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id,
        }).populate({ path: "accountRefId", model: Client });
      } else if (chartType === "Suppliers") {
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id,
        }).populate({ path: "accountRefId", model: Supplier });
      } else if (chartType === "Stores") {
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id,
        }).populate({ path: "accountRefId", model: Store });
      } else if (chartType === "Bank") {
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id,
        }).populate({ path: "accountRefId", model: Bank });
      }

      chartAccounts = chartAccounts.filter((account) => {
        return account.accountRefId !== null;
      });
      res.status(200).send({ chartAccounts });
    } else {
      res.status(200).send({ chartAccounts: [] });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// add old amount for account
router.post("/addOldAccountBalance/:accountID", async (req, res) => {
  const accountID = req.params.accountID;
  const amountAdded = req.body.amount;
  const info = req.body.info;

  try {
    let chartAccount = await ChartAccount.findById(accountID);

    if (!chartAccount) {
      throw new Error("no_account");
    }

    let dailyJournal;

    let chartAccountInvoice = new ChartAccountInvoices({
      chartAccountID: accountID,
      amount: amountAdded,
      description: "اول المدة",
      type: true,
    });

    if (info === "Customer") {
      dailyJournal = new DailyJournal({
        description: "اول المدة لعميل",
        amountDebit: amountAdded,
        amountCredit: 0,
        chartAccountID: chartAccount._id,
        invoicesHeaderID: chartAccountInvoice._id,
      });

      chartAccount.amountDebit = amountAdded;
      chartAccount.amountCredit = 0;
      chartAccount.balance = amountAdded;
    } else if (info === "Supplier") {
      dailyJournal = new DailyJournal({
        description: "اول المدة لمورد",
        amountDebit: 0,
        amountCredit: amountAdded,
        chartAccountID: chartAccount._id,
        invoicesHeaderID: chartAccountInvoice._id,
      });

      chartAccount.amountDebit = 0;
      chartAccount.amountCredit = amountAdded;
      chartAccount.balance = amountAdded;
    } else if (info === "Store") {
      dailyJournal = new DailyJournal({
        description: "اول المدة لخزينة",
        amountDebit: amountAdded,
        amountCredit: 0,
        chartAccountID: chartAccount._id,
        invoicesHeaderID: chartAccountInvoice._id,
      });

      chartAccount.treasury.amountDebit = amountAdded;
      chartAccount.treasury.amountCredit = 0;
      chartAccount.treasury.balance = amountAdded;
    }
    await chartAccount.save();
    await dailyJournal.save();
    await chartAccountInvoice.save();
    res.status(200).send({ chartAccount });
  } catch (e) {
    console.log(e);

    if (e.message === "no_account") {
      res.status(400).send({ message: "no account with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// add transfer between account
router.post("/transferBetweenAccounts/:accountID", async (req, res) => {
  const accountID = req.params.accountID;
  const amountAdded = req.body.amount;
  const type = req.body.type;
  const accountName = req.body.accountName;

  try {
    let chartAccount = await ChartAccount.findById(accountID).populate(
      "parentChartAccountID"
    );

    if (!chartAccount) {
      throw new Error("no_account");
    }

    let chartAccountInvoice = new ChartAccountInvoices({
      chartAccountID: accountID,
      amount: amountAdded,
      description: type
        ? "سحب من حساب " + accountName
        : "اضافة الي حساب " + accountName,
      type,
      amountBefore:
        chartAccount.parentChartAccountID.accountName === "Stores"
          ? chartAccount.treasury.balance
          : chartAccount.balance,
      amountAfter:
        chartAccount.parentChartAccountID.accountName === "Stores"
          ? chartAccount.treasury.balance + amountAdded
          : chartAccount.balance + amountAdded,
    });

    let dailyJournal = new DailyJournal({
      description: type
        ? "اضافة الي حساب " + accountName
        : "سحب من حساب " + accountName,
      amountDebit: type ? amountAdded : 0,
      amountCredit: type ? 0 : amountAdded,
      chartAccountID: chartAccount._id,
      invoicesHeaderID: chartAccountInvoice._id,
    });

    if (chartAccount.parentChartAccountID.accountName === "Bank") {
      chartAccount.amountDebit += type ? amountAdded : 0;
      chartAccount.amountCredit += type ? 0 : amountAdded;
      chartAccount.balance +=
        (type ? amountAdded : 0) - (type ? 0 : amountAdded);
    } else if (chartAccount.parentChartAccountID.accountName === "Stores") {
      chartAccount.treasury.amountDebit += type ? amountAdded : 0;
      chartAccount.treasury.amountCredit += type ? 0 : amountAdded;
      chartAccount.treasury.balance +=
        (type ? amountAdded : 0) - (type ? 0 : amountAdded);
    }

    await chartAccount.save();
    await dailyJournal.save();
    await chartAccountInvoice.save();
    res.status(200).send({ chartAccount });
  } catch (e) {
    console.log(e);

    if (e.message === "no_account") {
      res.status(400).send({ message: "no account with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
