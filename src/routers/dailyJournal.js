const express = require("express");
const router = new express.Router();
const DailyJournal = require("../models/dailyJournal");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");
const Bank = require("../models/bank");

router.post("/addDailyJournalForSales", async (req, res) => {
  // const mainChartAccountID = req.body.mainChartAccountID;
  // {description, amountDebit, amountCredit}
  const dailyJournalData = req.body.dailyJournalData;
  const invoiceHeaderID = req.body.invoiceHeaderID;

  try {
    if (!dailyJournalData || !invoiceHeaderID) {
      throw new Error("miss_data");
    }
    // {description, amountDebit, amountCredit}
    for (let dailyJournalObj of dailyJournalData) {
      let chartAccount = await ChartAccount.findOne({
        accountRefId: dailyJournalObj.refID,
      });

      if (chartAccount) {
        let dailyJournal = new DailyJournal({
          description: dailyJournalObj.description,
          amountDebit: dailyJournalObj.amountDebit,
          amountCredit: dailyJournalObj.amountCredit,
          chartAccountID: chartAccount._id,
          invoicesHeaderID: invoiceHeaderID,
        });

        if (dailyJournalObj.info === "العميل") {
          chartAccount.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        } else if (dailyJournalObj.info === "بضاعة") {
          chartAccount.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        } else if (dailyJournalObj.info === "ارباح") {
          chartAccount.netProfit.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.netProfit.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.netProfit.balance +=
            dailyJournalObj.amountCredit - dailyJournalObj.amountDebit;
        } else if (dailyJournalObj.info === "الخزينة") {
          chartAccount.treasury.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.treasury.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.treasury.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        } else if (dailyJournalObj.info === "مصروفات") {
          chartAccount.dailyExpenses.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.dailyExpenses.amountCredit +=
            dailyJournalObj.amountCredit;
          chartAccount.dailyExpenses.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        }
        await chartAccount.save();
        await dailyJournal.save();
        // }else{
        //   let chartAccount = new ChartAccount({
        //     accountName: dailyJournalObj.description
        //   });
        //   await chartAccount.save();
        //   let dailyJournal = new DailyJournal({
        //     description: dailyJournalObj.description,
        //     amountDebit: dailyJournalObj.amountDebit,
        //     amountCredit: dailyJournalObj.amountCredit,
        //     chartAccountID: chartAccount._id,
        //     invoiceHeaderID: invoiceHeaderID
        //   });
        //   await dailyJournal.save();
        // throw new Error('account_not_found')
      }
    }

    res.status(200).send({ message: "data send" });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.message === "account_not_found") {
      res.status(400).send({ message: "لا توجد حسابات متوفرة" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

router.post("/addDailyJournalForPurchase", async (req, res) => {
  // const mainChartAccountID = req.body.mainChartAccountID;
  // {description, amountDebit, amountCredit}
  const dailyJournalData = req.body.dailyJournalData;
  const purchaseHeaderID = req.body.purchaseHeaderID;

  try {
    if (!dailyJournalData || !purchaseHeaderID) {
      throw new Error("miss_data");
    }
    // {description, amountDebit, amountCredit}
    for (let dailyJournalObj of dailyJournalData) {
      let chartAccount = await ChartAccount.findOne({
        accountRefId: dailyJournalObj.refID,
      });

      if (chartAccount) {
        let dailyJournal = new DailyJournal({
          description: dailyJournalObj.description,
          amountDebit: dailyJournalObj.amountDebit,
          amountCredit: dailyJournalObj.amountCredit,
          chartAccountID: chartAccount._id,
          invoicesHeaderID: purchaseHeaderID,
        });

        if (dailyJournalObj.info === "المورد") {
          chartAccount.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.balance +=
            dailyJournalObj.amountCredit - dailyJournalObj.amountDebit;
        } else if (dailyJournalObj.info === "الخزينة") {
          chartAccount.treasury.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.treasury.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.treasury.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        } else if (dailyJournalObj.info === "بضاعة") {
          chartAccount.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        }
        await chartAccount.save();
        await dailyJournal.save();
        // }else{
        //   let chartAccount = new ChartAccount({
        //     accountName: dailyJournalObj.description
        //   });
        //   await chartAccount.save();
        //   let dailyJournal = new DailyJournal({
        //     description: dailyJournalObj.description,
        //     amountDebit: dailyJournalObj.amountDebit,
        //     amountCredit: dailyJournalObj.amountCredit,
        //     chartAccountID: chartAccount._id,
        //     invoiceHeaderID: invoiceHeaderID
        //   });
        //   await dailyJournal.save();
        // throw new Error('account_not_found')
      }
    }

    res.status(200).send({ message: "data send" });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.message === "account_not_found") {
      res.status(400).send({ message: "لا توجد حسابات متوفرة" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

router.post("/addDailyJournalForBanks", async (req, res) => {
  // const mainChartAccountID = req.body.mainChartAccountID;
  // {description, amountDebit, amountCredit}
  const dailyJournalData = req.body.dailyJournalData;
  const invoiceHeaderID = req.body.invoiceHeaderID;

  try {
    if (!dailyJournalData || !invoiceHeaderID) {
      throw new Error("miss_data");
    }
    // {description, amountDebit, amountCredit}
    for (let dailyJournalObj of dailyJournalData) {
      let chartAccount = await ChartAccount.findOne({
        accountRefId: dailyJournalObj.refID,
      });

      if (chartAccount) {
        let dailyJournal = new DailyJournal({
          description: dailyJournalObj.description,
          amountDebit: dailyJournalObj.amountDebit,
          amountCredit: dailyJournalObj.amountCredit,
          chartAccountID: chartAccount._id,
          invoicesHeaderID: invoiceHeaderID,
        });
        if (dailyJournalObj.info === "بنك") {
          chartAccount.amountDebit += dailyJournalObj.amountDebit;
          chartAccount.amountCredit += dailyJournalObj.amountCredit;
          chartAccount.balance +=
            dailyJournalObj.amountDebit - dailyJournalObj.amountCredit;
        }
        await chartAccount.save();
        await dailyJournal.save();
      } else {
        throw new Error("no_bank");
      }
    }

    res.status(200).send({ message: "data send" });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.message === "account_not_found") {
      res.status(400).send({ message: "لا توجد حسابات متوفرة" });
    } else if (e.message === "no_bank") {
      res.status(400).send({ message: "بيانات البنك غير متوفرة" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
