const express = require("express");
const router = new express.Router();
const InventoryMoveHeader = require("../models/inventoryMoveHeader");
const StockMovement = require("../models/stockMovement");
const ProductPerStore = require("../models/productPerStore");
const Product = require("../models/products");

router.post("/addInventoryMoveHeader", async (req, res) => {
  
  const type = req.body.type;
  const description = req.body.description;
  const storeID = req.body.storeID;
  const invoiceRefHeaderID = req.body.invoiceRefHeaderID;
  const products = req.body.products;
  const operationDate = req.body.operationDate;
  
  try {
    if (
      !type ||
      !description ||
      !storeID ||
      // !invoiceRefHeaderID ||
      !products
    ) {
      throw new Error("miss_data");
    }

    const inventoryMoveHeader = new InventoryMoveHeader({
      type,
      description,
      storeID,
      invoiceRefHeaderID,
      operationDate
    });
    await inventoryMoveHeader.save();
    for(let product of products){
      let productPerStoreData = await ProductPerStore.findOne({'productID': product._id, 'storeID': storeID});
      let stockMovement = new StockMovement({
        'change': product.change,
        'type': product.type,
        'quantityBefore': productPerStoreData.quantity,
        'quantityAfter': (productPerStoreData.quantity + product.change),
        'description': product.description,
        'storeID': product.storeID,
        'amountOfReturn': 0,
        'product': product.product,
        'inventoryHeaderID': inventoryMoveHeader._id,
        operationDate
      });
      productPerStoreData.quantity += product.change;
      if(productPerStoreData.quantity < 0){
        throw new Error("moreThan")
      }
      await productPerStoreData.save();
      await stockMovement.save();
    }

  
    res.status(200).send({ inventoryMoveHeader });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if(e.message === "moreThan"){
      res.status(400).send({ message: "لا توجد كمية كافية في المخزن" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


router.post("/firstInventoryMoveHeader", async (req, res) => {
  
  const type = req.body.type;
  const description = req.body.description;
  const storeID = req.body.storeID;
  const invoiceRefHeaderID = req.body.invoiceRefHeaderID;
  const products = req.body.products;
  const operationDate = req.body.operationDate;
  
  try {
    if (
      !type ||
      !description ||
      !storeID ||
      // !invoiceRefHeaderID ||
      !products
    ) {
      throw new Error("miss_data");
    }
    console.log(storeID)
    let newProducts = [];
    if(products){
      for (let product of products) {
        let productInStore = await Product.findOne({ name: product.Name.trim() });
        if (productInStore) {
          let productPerStore = await ProductPerStore.findOne({
            productID: productInStore._id,
            storeID: storeID,
          });
  
          if(productPerStore){
            productPerStore.quantity = product.Quantity;
            productInStore.cost = product.Cost;
            productInStore.price = product.Price;
            productInStore.code = product.Code;
          }else{
            productPerStore = new ProductPerStore({
              quantity: +product.Quantity,
              storeID: storeID,
              productID: productInStore._id
            });
          }
          newProducts.push({...productInStore,quantity: product.Quantity })
          await productInStore.save();
          await productPerStore.save();
        } else {
          let productInStore = new Product({
            name: product.Name,
            cost: product.Cost,
            price: product.Price,
            code : product.Code,
            online: false
          });
          
          await productInStore.save();
          let productPerStore = new ProductPerStore({
            quantity: +product.Quantity,
            storeID: storeID,
            productID: productInStore._id
          });
          newProducts.push({...productInStore,quantity: product.Quantity })
          console.log( product.Quantity)
          console.log( "asda" + productPerStore.quantity)
          await productPerStore.save();
        }
      }
    }

    const inventoryMoveHeader = new InventoryMoveHeader({
      type,
      description,
      storeID,
      invoiceRefHeaderID,
      operationDate
    });
    await inventoryMoveHeader.save();

    for(let product of newProducts){
      console.log(product)
      let stockMovement = new StockMovement({
        'change': 0,
        'type': 'in',
        'quantityBefore': 0,
        'quantityAfter': (product.quantity),
        'description': description,
        'storeID': storeID,
        'amountOfReturn': 0,
        'product': product._id,
        'inventoryHeaderID': inventoryMoveHeader._id,
        operationDate
      });
      
      await stockMovement.save();
    }

  
    res.status(200).send({ inventoryMoveHeader });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if(e.message === "moreThan"){
      res.status(400).send({ message: "لا توجد كمية كافية في المخزن" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

router.post("/InventoryMoveHeaderStores", async (req, res) => {
  
  const type = req.body.type;
  const description = req.body.description;
  const storeID = req.body.storeID;
  const invoiceRefHeaderID = req.body.invoiceRefHeaderID;
  const products = req.body.products;
  const operationDate = req.body.operationDate;
  
  try {
    if (
      !type ||
      !description ||
      !storeID ||
      // !invoiceRefHeaderID ||
      !products
    ) {
      throw new Error("miss_data");
    }

    console.log(storeID)
    const inventoryMoveHeader = new InventoryMoveHeader({
      type,
      description,
      storeID,
      invoiceRefHeaderID,
      operationDate
    });
    await inventoryMoveHeader.save();

    for(let product of products){
      let productPerStoreData = await ProductPerStore.findOne({'productID': product._id, 'storeID': storeID});
      if(productPerStoreData){
      }else{
        console.log('ss')
        productPerStoreData = new ProductPerStore({
          quantity: 0,
          storeID: storeID,
          productID: product._id
        });        
      }
      let stockMovement = new StockMovement({
        'change': product.change,
        'type': product.type,
        'quantityBefore': productPerStoreData.quantity,
        'quantityAfter': (productPerStoreData.quantity + product.change),
        'description': product.description,
        'storeID': product.storeID,
        'amountOfReturn': 0,
        'product': product.product,
        'inventoryHeaderID': inventoryMoveHeader._id,
        operationDate
      });
      productPerStoreData.quantity += product.change
      if(productPerStoreData.quantity < 0){
        throw new Error("moreThan")
      }
      await productPerStoreData.save();
      await stockMovement.save();
    }

    res.status(200).send({ inventoryMoveHeader });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if(e.message === "moreThan"){
      res.status(400).send({ message: "لا توجد كمية كافية في المخزن" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;