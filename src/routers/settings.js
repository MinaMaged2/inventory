const express = require("express");
const router = new express.Router();
const Client = require("../models/clients");
const ChartAccount = require('../models/chartAccounts');
const DailyJournal = require("../models/dailyJournal");
const MainChartAccount = require("../models/mainChartAccount");
const InventoryMoveHeader = require("../models/inventoryMoveHeader");
const StockMovement = require("../models/stockMovement");
const ProductPerStore = require("../models/productPerStore");
const Product = require("../models/products");
const InvoiceHeader = require("../models/invoiceHeader");
const Order = require("../models/orders");
const PurchaseHeader = require("../models/purchaseHeader");
const Supplier = require("../models/suppliers");
const Store = require("../models/store");
const auth = require("../middleware/auth");


// clear all data
router.get("/resetAllData", async (req, res) => {
  try {
    await Client.collection.drop();
    await ChartAccount.collection.drop();
    await DailyJournal.collection.drop();
    await MainChartAccount.collection.drop();
    await InventoryMoveHeader.collection.drop();
    await StockMovement.collection.drop();
    await ProductPerStore.collection.drop();
    await Product.collection.drop();
    await InvoiceHeader.collection.drop();
    await Order.collection.drop();
    await PurchaseHeader.collection.drop();
    await Supplier.collection.drop();
    await Store.collection.drop();
    res.status(200).send({'done': 'All Data removed'})
  } catch (e) {
    console.log(e)
    res.status(400).send({'error': e})
  }
});

// reset all data without the main settings
// clients
// suppliers
// stores
router.get("/resetData", async (req, res) => {
  try {

    let clientsMainChartAccount = await MainChartAccount.findOne({
      accountName: "Customers",
    });
    let suppliersMainChartAccount = await MainChartAccount.findOne({
      accountName: "Suppliers",
    });
    let storesMainChartAccount = await MainChartAccount.findOne({
      accountName: "Stores",
    });

    if(clientsMainChartAccount){
      const clientsAccounts = await ChartAccount.find({
        parentChartAccountID: clientsMainChartAccount._id
      });

      for( let client of clientsAccounts){
        client.balance = 0;
        client.amountDebit = 0;
        client.amountCredit = 0;
        client.netProfit = 0;
        await client.save();
      }
    }

    if(suppliersMainChartAccount){
      const suppliersAccounts = await ChartAccount.find({
        parentChartAccountID: suppliersMainChartAccount._id
      });

      for( let supplier of suppliersAccounts){
        supplier.balance = 0;
        supplier.amountDebit = 0;
        supplier.amountCredit = 0;
        supplier.netProfit = 0;
        await supplier.save();
      }
    }

    if(storesMainChartAccount){
      const storesAccounts = await ChartAccount.find({
        parentChartAccountID: storesMainChartAccount._id
      });

      for( let store of storesAccounts){
        store.balance =0;
        store.amountDebit = 0;
        store.amountCredit = 0;
        store.netProfit = {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        };
        store.treasury = {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        }
        store.dailyExpenses = {
          balance: 0,
          amountDebit: 0,
          amountCredit: 0,
        }
        await store.save();
      }
    }
  
    await DailyJournal.collection.drop();
    await InventoryMoveHeader.collection.drop();
    await StockMovement.collection.drop();
    await ProductPerStore.collection.drop();
    await Product.collection.drop();
    await InvoiceHeader.collection.drop();
    await Order.collection.drop();
    await PurchaseHeader.collection.drop();
    res.status(200).send({'done': 'All Data removed'})
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;