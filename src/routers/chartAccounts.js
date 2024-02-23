const express = require("express");
const router = new express.Router();
const ChartAccount = require('../models/chartAccounts');
const MainChartAccount = require('../models/mainChartAccount');

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
router.get("/storeChartAccounts", async (req, res) => {
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

module.exports = router;