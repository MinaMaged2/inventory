const express = require("express");
const router = new express.Router();
const StockMovement = require("../models/stockMovement");
const InventoryMoveHeader = require("../models/inventoryMoveHeader");

router.post("/addStockMovement", async (req, res) => {
  const change = req.body.change;
  const type = req.body.type;
  const quantityBefore = req.body.quantityBefore;
  const quantityAfter = req.body.quantityAfter;
  const description = req.body.description;
  const storeID = req.body.storeID;
  const product = req.body.product;
  const inventoryHeaderID = req.body.inventoryHeaderID;
  const operationDate = req.body.operationDate;

  
  try {
    if (
      !change ||
      !type ||
      !quantityBefore ||
      !quantityAfter ||
      !description ||
      !storeID ||
      !product ||
      !inventoryHeaderID
    ) {
      throw new Error("miss_data");
    }

    const stockMovement = new StockMovement({
      change,
      type,
      quantityBefore,
      quantityAfter,
      description,
      storeID,
      product,
      inventoryHeaderID,
      operationDate
    });

    await stockMovement.save();
    res.status(200).send({ stockMovement });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all movements for invoice
router.get("/movementsByInvoice/:id", async (req, res) => {
  const invoiceID = req.params.id;

  try {

    const inventoryMoveHeader = await InventoryMoveHeader.findOne({
      invoiceRefHeaderID: invoiceID
    });

    if(!inventoryMoveHeader){
      throw new Error('no_inventoryHeader')
    }

    const movements = await StockMovement.find({
      inventoryHeaderID: inventoryMoveHeader._id
    });

    res.status(200).send({ movements });
  } catch (e) {
    if(e.message === "no_inventoryHeader"){
      res.status(400).send({ message: "no inventory header with this ID" });
    }else{
    res.status(400).send({ message: "an error has occurred" });
    }
  }
});


module.exports = router;
