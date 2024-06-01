const express = require("express");
const router = new express.Router();
const ChartAccount = require('../models/chartAccounts');
const MainChartAccount = require('../models/mainChartAccount');
const Client = require('../models/clients');
const Supplier = require('../models/suppliers');
const Store = require('../models/store');
const ChartAccountInvoices = require('../models/chartAccountsInvoices');

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
      accountName: chartType
    });

    if(mainChartAccount){
      const chartAccounts = await ChartAccount.find({
        parentChartAccountID: mainChartAccount._id
      });
      res.status(200).send({ chartAccounts });
    }else{
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
      accountRefId: chartID
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
      accountName: chartType
    });

    if(mainChartAccount){

      let chartAccounts;

      if(chartType === 'Customers'){
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id
        }).populate({ path: 'accountRefId', model: Client });
      }else if(chartType === 'Suppliers'){
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id
        }).populate({ path: 'accountRefId', model: Supplier });
      }else if(chartType === 'Stores'){
        chartAccounts = await ChartAccount.find({
          parentChartAccountID: mainChartAccount._id
        }).populate({ path: 'accountRefId', model: Store });
      }
      
      
      chartAccounts = chartAccounts.filter( account => {
        return account.accountRefId !== null
      });
      res.status(200).send({ chartAccounts });
    }else{
      res.status(200).send({ chartAccounts: [] });
    }
    
  } catch (e) {
    console.log(e)
    res.status(400).send({ message: "an error has occurred" });
  }
});


// add old amount for account
router.post("/addOldAccountBalance/:accountID", async (req, res) => {
  const accountID = req.params.accountID;
  const amountAdded = req.body.amount;
  const type = req.body.type;

  try {
    let chartAccount = await ChartAccount.findById(accountID);

    if(!chartAccount){
      throw new Error("no_account");
    }

    if(type === 'Customer' || type === 'Supplier'){
      chartAccount.balance = amountAdded;
    }else if(type === 'Store'){
      chartAccount.treasury.balance = amountAdded
    }
    await chartAccount.save();
    let chartAccountInvoice = new ChartAccountInvoices({
      chartAccountID: accountID,
      amount: amountAdded
    });

    await chartAccountInvoice.save();
    res.status(200).send({ chartAccount });
  } catch (e) {
    console.log(e)

    if (e.message === "no_account") {
      res.status(400).send({ message: "no account with this ID" });
    }else{
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;