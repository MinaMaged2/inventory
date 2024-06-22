const express = require("express");
const router = new express.Router();
const ExpenseHeader = require("../models/expenseHeader");

router.post("/addExpenseHeader", async (req, res) => {
  const description = req.body.description;
  const invoiceTotal = req.body.invoiceTotal;
  const storeID = req.body.storeID;
  const employeeID = req.body.employeeID;
  const expenseTypeID = req.body.expenseTypeID;
  const operationDate = req.body.operationDate;

  try {
    console.log(req.body);
    if (!storeID || !invoiceTotal) {
      throw new Error("miss_data");
    }

    const expenseHeader = new ExpenseHeader({
      description,
      invoiceTotal,
      storeID,
      employeeID,
      expenseTypeID,
      operationDate,
    });

    await expenseHeader.save();
    res.status(200).send({ expenseHeader });
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
router.get("/ExpenseHeaders", async (req, res) => {
  const startFrom = req.query.startFrom;
  const endTo = req.query.endTo;
  const storeID = req.query.storeID;
  const expenseTypeName = req.query.expenseTypeName;
  const expenseTypeID = req.query.expenseTypeID;

  try {
    // get
    if (expenseTypeName == "null") {
      if (storeID != "null" && storeID && storeID != "undefined") {
        const expenseHeaders = await ExpenseHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo },
          storeID,
        })
          .populate("employeeID")
          .populate("expenseTypeID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ expenseHeaders });
      } else {
        const expenseHeaders = await ExpenseHeader.find({
          operationDate: { $gte: startFrom, $lte: endTo },
        })
          .populate("employeeID")
          .populate("expenseTypeID")
          .populate("storeID")
          .sort({ operationDate: "desc" });
        res.status(200).send({ expenseHeaders });
      }
    } else {
      let expenseHeaders;

      if (expenseTypeName === "employee") {
        if (storeID != "null" && storeID && storeID != "undefined") {
          if(employeeID != "null"){
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              storeID,
              employeeID: expenseTypeID,
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }else{
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              storeID,
              employeeID: { $ne: null },
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }
          
        } else {
          if(employeeID != "null"){
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              employeeID: expenseTypeID,
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }else{
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              employeeID: { $ne: null },
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }
        }
      } else {
        if (storeID != "null" && storeID && storeID != "undefined") {
          if(expenseTypeID != "null"){
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              storeID,
              expenseTypeID: expenseTypeID,
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }else{
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              storeID,
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }
        } else {
          if(expenseTypeID != "null"){
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
              expenseTypeID: expenseTypeID,
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }else{
            expenseHeaders = await ExpenseHeader.find({
              operationDate: { $gte: startFrom, $lte: endTo },
            })
              .populate("employeeID")
              .populate("expenseTypeID")
              .populate("storeID")
              .sort({ operationDate: "desc" });
          }
        }
      }

      res.status(200).send({ expenseHeaders });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all Invoices

// router.get("/InvoiceHeaders", async (req, res) => {
//   const invoiceType = req.query.invoiceType;
//   const startFrom = req.query.startFrom;
//   const endTo = req.query.endTo;
//   const storeID = req.query.storeID;
//   try {
//     if (invoiceType == "null") {
//       if (storeID != "null" && storeID && storeID != "undefined") {
//         const invoiceHeaders = await InvoiceHeader.find({
//           operationDate: { $gte: startFrom, $lte: endTo },
//           storeID,
//         })
//           .populate("clientID")
//           .populate("storeID")
//           .sort({ operationDate: "desc" });
//         res.status(200).send({ invoiceHeaders });
//       } else {
//         const invoiceHeaders = await InvoiceHeader.find({
//           operationDate: { $gte: startFrom, $lte: endTo },
//         })
//           .populate("clientID")
//           .populate("storeID")
//           .sort({ operationDate: "desc" });
//         res.status(200).send({ invoiceHeaders });
//       }
//     } else {
//       if (storeID != "null" && storeID && storeID != "undefined") {
//         const invoiceHeaders = await InvoiceHeader.find({
//           paidYN: invoiceType,
//           operationDate: { $gte: startFrom, $lte: endTo },
//           storeID,
//         })
//           .populate("clientID")
//           .populate("storeID")
//           .sort({ operationDate: "desc" });
//         res.status(200).send({ invoiceHeaders });
//       } else {
//         const invoiceHeaders = await InvoiceHeader.find({
//           paidYN: invoiceType,
//           operationDate: { $gte: startFrom, $lte: endTo },
//         })
//           .populate("clientID")
//           .populate("storeID")
//           .sort({ operationDate: "desc" });
//         res.status(200).send({ invoiceHeaders });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).send({ message: "an error has occurred" });
//   }
// });

// get all Invoices for customer

// router.get("/InvoiceHeaders/:id", async (req, res) => {
//   const clientID = req.params.id;
//   const invoiceType = req.query.invoiceType;
//   const startFrom = req.query.startFrom;
//   const endTo = req.query.endTo;
//   try {
//     if (invoiceType === "null") {
//       const invoiceHeaders = await InvoiceHeader.find({
//         clientID: clientID,
//         operationDate: { $gte: startFrom, $lte: endTo },
//       })
//         .populate("clientID")
//         .populate("storeID");
//       res.status(200).send({ invoiceHeaders });
//     } else {
//       let typeOfPay = invoiceType === "true" ? true : false;
//       const invoiceHeaders = await InvoiceHeader.find({
//         clientID: clientID,
//         paidYN: typeOfPay,
//         operationDate: { $gte: startFrom, $lte: endTo },
//       })
//         .populate("clientID")
//         .populate("storeID");
//       res.status(200).send({ invoiceHeaders });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).send({ message: "an error has occurred" });
//   }
// });

module.exports = router;
