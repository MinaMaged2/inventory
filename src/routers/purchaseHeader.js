const express = require("express");
const router = new express.Router();
const PurchaseHeader = require("../models/purchaseHeader");
const Product = require("../models/products");
const ProductPerStore = require("../models/productPerStore");
const StockMovement = require("../models/stockMovement");

router.post("/addPurchaseHeader", async (req, res) => {
  const type = req.body.type;
  const description = req.body.description;
  const invoiceTotalWithTax = req.body.invoiceTotalWithTax;
  const amountPaid = req.body.amountPaid;
  const paidYN = req.body.paidYN;
  const storeID = req.body.storeID;
  const supplierID = req.body.supplierID;
  const products = req.body.products;
  const isPayment = req.body.isPayment;
  const isReturn = req.body.isReturn
  const operationDate = req.body.operationDate;
  const oldRemaining = req.body.oldRemaining;
  const descText = req.body.descText;
  const extraInfo = req.body.extraInfo;

  try {
    if (!invoiceTotalWithTax || !supplierID) {
      throw new Error("miss_data");
    }
    console.log("purchase: ", products);
    let newProducts = [];
    // {name, cost, price, quantity}

    if (products) {
      for (let product of products) {
        let productInStore = await Product.findOne({
          name: product.Name.trim(),
        });
        if (productInStore) {
          
          let productPerStore = await ProductPerStore.findOne({
            productID: productInStore._id,
            storeID: storeID,
          });

          if (!productPerStore) {
            productPerStore = new ProductPerStore({
              quantity: 0,
              storeID: storeID,
              productID: productInStore._id,
            });
          }

          if(productPerStore.quantity > 0){
            productInStore.cost = product.Cost;
            productInStore.mediumCost = (product.Cost + productInStore.mediumCost) / 2
          }else{
            productInStore.cost = product.Cost;
            productInStore.mediumCost = product.Cost;
          }
          // productInStore.price = (product.Price + productInStore.price) / 2;
          productInStore.price = product.Price;
          productInStore.code = product.Code;
          newProducts.push({
            ...productInStore._doc,
            quantity: product.Quantity,
          });
          await productInStore.save();
          await productPerStore.save();
        } else {
          let productInStore = new Product({
            name: product.Name,
            cost: product.Cost,
            mediumCost: product.Cost,
            price: product.Price,
            code: product.Code,
            online: false,
          });
          newProducts.push({
            ...productInStore._doc,
            quantity: product.Quantity,
          });
          await productInStore.save();
          let productPerStore = new ProductPerStore({
            quantity: 0,
            storeID: storeID,
            productID: productInStore._id,
          });
          await productPerStore.save();
        }
      }
    }

    const purchaseHeader = new PurchaseHeader({
      type,
      description,
      invoiceTotalWithTax,
      amountPaid,
      paidYN,
      descText,
      supplierID,
      storeID,
      isPayment,
      isReturn,
      oldRemaining,
      amountPaidDebit: amountPaid,
      operationDate,
      extraInfo
    });
    console.log("products: ", newProducts);
    await purchaseHeader.save();
    res.status(200).send({ purchaseHeader, products: newProducts });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all Invoices
router.get("/PurchaseHeaders", async (req, res) => {
  const purchaseType = req.query.invoiceType;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  const storeID = req.query.storeID;
  try {
    if (purchaseType === "null") {
      if (storeID != "null" && storeID && storeID != "undefined") {
        const purchaseHeaders = await PurchaseHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo },
          storeID,
        })
          .populate("supplierID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ purchaseHeaders });
      } else {
        console.log(startFrom, endTo)
        const purchaseHeaders = await PurchaseHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo }
        })
          .populate("supplierID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ purchaseHeaders });
      }
    } else {
      if (storeID != "null" && storeID && storeID != "undefined") {
        const purchaseHeaders = await PurchaseHeader.find({
          paidYN: purchaseType,
          operationDate: { $gte: startFrom, $lte: endTo },
          storeID,
        })
          .populate("supplierID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ purchaseHeaders });
      } else {
        const purchaseHeaders = await PurchaseHeader.find({
          paidYN: purchaseType,
          operationDate: { $gte: startFrom, $lte: endTo },
        })
          .populate("supplierID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ purchaseHeaders });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all Invoices
router.get("/PurchaseHeaders/:id", async (req, res) => {
  const supplierID = req.params.id;
  const invoiceType = req.query.invoiceType;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  try {
    if (invoiceType === "null") {
      const invoiceHeaders = await PurchaseHeader.find({
        supplierID: supplierID,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("supplierID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    } else {
      let typeOfPay = invoiceType === "true" ? true : false;
      const invoiceHeaders = await PurchaseHeader.find({
        supplierID: supplierID,
        paidYN: typeOfPay,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("supplierID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// edit invoice payment
router.put("/purchase/:id", async (req, res) => {
  const invoiceID = req.params.id;

  console.log(req.body);
  console.log(typeof req.body.paidYN);
  const updates = Object.keys(req.body);
  const allowedUpdates = ["paidYN", "amountPaidDebit"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const invoice = await PurchaseHeader.findById(invoiceID);

    if (!invoice) {
      throw new Error("no_invoice");
    }

    updates.forEach((update) => {
      invoice[update] = req.body[update];
    });

    await invoice.save();

    res.status(200).send({ invoice });
  } catch (e) {
    if (e.message === "no_invoice") {
      res.status(400).send({ message: "no client with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// get all sale invoices for supplier
router.get("/PurchaseInvoiceHeaders/:id", async (req, res) => {
  const supplierID = req.params.id;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  try {
    const invoiceHeaders = await PurchaseHeader.find({
      supplierID: supplierID,
      isReturn: false,
      isPayment: false,
      operationDate: { $gte: startFrom, $lte: endTo },
    })
      .populate("supplierID")
      .populate("storeID")
      .sort({ operationDate: -1 });
    res.status(200).send({ invoiceHeaders });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// edit invoice for return
router.put("/returnPurchase/", async (req, res) => {

  console.log(req.body);
  const products = req.body.products;

  try {

    for(let product of products){
      console.log(product)
      let invoice = await PurchaseHeader.findById(product.invoiceID);
      if (!invoice) {
        throw new Error("no_invoice");
      }
      invoice.amountPaidDebit += product.totalReturn;
      // invoice.profit -= product.profit;

      let stockMovement = await StockMovement.findById(product.stockMovementID);
      stockMovement.amountOfReturn += product.returnAmount;
      
      await invoice.save();
      await stockMovement.save();
    }
  
    res.status(200).send({ message: "invoice and stock updated" });
  } catch (e) {
    console.log(e);
    if (e.message === "no_invoice") {
      res.status(400).send({ message: "no invoice with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
