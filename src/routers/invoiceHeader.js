const express = require("express");
const router = new express.Router();
const InvoiceHeader = require("../models/invoiceHeader");
const StockMovement = require("../models/stockMovement");

router.post("/addInvoiceHeader", async (req, res) => {
  const type = req.body.type;
  const description = req.body.description;
  const invoiceTotalWithTax = req.body.invoiceTotalWithTax;
  const invoiceTotalNoTax = req.body.invoiceTotalWithTax;
  const amountPaid = req.body.amountPaid;
  const paidYN = req.body.paidYN;
  const storeID = req.body.storeID;
  const clientID = req.body.clientID;
  const discount = req.body.discount;
  const profit = req.body.profit;
  const isPayment = req.body.isPayment;
  const isReturn = req.body.isReturn;
  const oldRemaining = req.body.oldRemaining;
  const descText = req.body.descText;
  const operationDate = req.body.operationDate;

  try {
    console.log(req.body);
    if (!invoiceTotalWithTax || !invoiceTotalNoTax) {
      throw new Error("miss_data");
    }

    const invoiceHeader = new InvoiceHeader({
      type,
      description,
      descText,
      invoiceTotalWithTax,
      invoiceTotalNoTax,
      amountPaid,
      paidYN,
      clientID,
      storeID,
      profit,
      isPayment,
      amountPaidDebit: amountPaid,
      isReturn: isReturn ? isReturn : false,
      oldRemaining,
      operationDate
    });

    await invoiceHeader.save();
    res.status(200).send({ invoiceHeader });
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
router.get("/InvoiceHeaders", async (req, res) => {
  const invoiceType = req.query.invoiceType;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  const storeID = req.query.storeID;
  try {
    if (invoiceType == "null") {
      if (storeID != 'null' && storeID && storeID != 'undefined') {
        const invoiceHeaders = await InvoiceHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo },
          storeID,
        })
          .populate("clientID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ invoiceHeaders });
      } else {
        const invoiceHeaders = await InvoiceHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo },
        })
          .populate("clientID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ invoiceHeaders });
      }
    } else {
      if (storeID != 'null' && storeID && storeID != 'undefined') {
        const invoiceHeaders = await InvoiceHeader.find({
          paidYN: invoiceType,
          operationDate: { $gte: startFrom, $lte: endTo },
          storeID,
        })
          .populate("clientID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ invoiceHeaders });
      } else {
        const invoiceHeaders = await InvoiceHeader.find({
          paidYN: invoiceType,
          operationDate: { $gte: startFrom, $lte: endTo },
        })
          .populate("clientID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ invoiceHeaders });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all Invoices for customer
router.get("/InvoiceHeaders/:id", async (req, res) => {
  const clientID = req.params.id;
  const invoiceType = req.query.invoiceType;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  try {
    if (invoiceType === "null") {
      const invoiceHeaders = await InvoiceHeader.find({
        clientID: clientID,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("clientID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    } else {
      let typeOfPay = invoiceType === "true" ? true : false;
      const invoiceHeaders = await InvoiceHeader.find({
        clientID: clientID,
        paidYN: typeOfPay,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("clientID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all debit Invoices for customer
router.get("/debitInvoiceHeaders/:id", async (req, res) => {
  const clientID = req.params.id;
  const invoiceType = req.query.invoiceType;
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  try {
    if (invoiceType === "null") {
      const invoiceHeaders = await InvoiceHeader.find({
        clientID: clientID,
        isReturn: false,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("clientID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    } else {
      let typeOfPay = invoiceType === "true" ? true : false;
      const invoiceHeaders = await InvoiceHeader.find({
        clientID: clientID,
        paidYN: typeOfPay,
        isReturn: false,
        operationDate: { $gte: startFrom, $lte: endTo },
      })
        .populate("clientID")
        .populate("storeID");
      res.status(200).send({ invoiceHeaders });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// edit invoice payment
router.put("/invoice/:id", async (req, res) => {
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

    const invoice = await InvoiceHeader.findById(invoiceID);

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

// edit invoice for return
router.put("/returnInvoice/:id", async (req, res) => {
  const invoiceID = req.params.id;

  console.log(req.body);
  const products = req.body.products;

  const updates = Object.keys(req.body.invoiceUpdates);
  const allowedUpdates = [
    // "invoiceTotalWithTax",
    // "invoiceTotalNoTax",
    // "amountPaid",
    "amountPaidDebit",
    "profit",
  ];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const invoice = await InvoiceHeader.findById(invoiceID);

    if (!invoice) {
      throw new Error("no_invoice");
    }

    updates.forEach((update) => {
      invoice[update] = req.body.invoiceUpdates[update];
    });

    for (let product of products) {
      let stockMovement = await StockMovement.findById(product.stockMovementID);
      stockMovement.amountOfReturn = product.returnAmount;
      await stockMovement.save();
    }

    await invoice.save();

    res.status(200).send({ invoice });
  } catch (e) {
    console.log(e);
    if (e.message === "no_invoice") {
      res.status(400).send({ message: "no client with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
