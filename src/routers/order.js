const express = require("express");
const router = new express.Router();
const Order = require("../models/incomingInvocies");
const Product = require("../models/products");

// add order
router.post("/addOrder", async (req, res) => {
  const clientID = req.body.clientID;
  const orderData = req.body.orderData;
  const totalPrice = req.body.totalPrice;
  const paidMoney = req.body.paidMoney;
  const remainingMoney = totalPrice - paidMoney;  

  try {
    if (!clientID || !orderData || totalPrice < 0 || paidMoney < 0) {
      console.log(clientID, orderData, totalPrice, paidMoney)
      throw new Error("miss_data");
    }

    orderData.forEach( async (order, i) => {
      const product = await Product.findById(order.productID);
      product.amount = product.amount - +order.amount;
      await product.save();
    });

    const order = new Order({ clientID, orderData, totalPrice, paidMoney, remainingMoney });

    await order.save();
    res.status(200).send({ order });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).populate('clientID');
    res.status(200).send({ orders });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get order
router.get("/order/:id", async (req, res) => {
  const orderID = req.params.id;

  try {
    const order = await Order.findById(orderID).populate('clientID');

    if (!order) {
      throw new Error("no_order");
    }

    res.status(200).send({ order });
  } catch (e) {
    if (e.message === "no_order") {
      res.status(400).send({ message: "no order with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// delete client
router.delete('/order/:id/delete', async (req, res) => {
  const orderID = req.params.id;

  try {
      await Order.findByIdAndDelete(orderID);
      const orders = await Order.find({}).populate('clientID');
      res.status(200).send({orders})
  } catch (e) {
      res.status(400).send({ message: "an error has occurred" });
  }
});


// get client orders
router.get("/clientOrders/:clientId", async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const order = await Order.find({clientID:clientId}).populate('clientID').sort({'createdAt': -1});

    if (!order) {
      throw new Error("no_order");
    }

    res.status(200).send({ 'order': order[0] });
  } catch (e) {
    if (e.message === "no_order") {
      res.status(400).send({ message: "no order with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;