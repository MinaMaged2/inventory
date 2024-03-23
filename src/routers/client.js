const express = require("express");
const router = new express.Router();
const Client = require("../models/clients");
const MainChartAccount = require("../models/mainChartAccount");
const ChartAccount = require("../models/chartAccounts");
const auth = require("../middleware/auth");

// add client
router.post("/addClient", auth,async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const address = req.body.address;
  const amountDebit = req.body.amountDebit;

  try {
    if (!name || !phone || !address || !amountDebit) {
      throw new Error("miss_data");
    }

    const client = new Client({ name, phone, address, amountDebit });
    await client.save();
    let mainChartAccount = await MainChartAccount.findOne({
      accountName: "Customers",
    });
    let accountName = "ع-" + client.clientID;
    if (mainChartAccount) {
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: client._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    } else {
      mainChartAccount = new MainChartAccount({ accountName: "Customers" });
      await mainChartAccount.save();
      const chartAccount = new ChartAccount({
        accountName,
        accountRefId: client._id,
        balance: 0,
        amountDebit: 0,
        amountCredit: 0,
        netProfit: 0,
        parentChartAccountID: mainChartAccount._id,
      });
      await chartAccount.save();
    }
    res.status(200).send({ client });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "بيانات العميل غير مكتملة" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "هذا العميل موجود بالفعل" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

// get all clients
router.get("/clients",  auth,async (req, res) => {
  try {
    const client = await Client.find({}).sort({ name: 1 });
    res.status(200).send({ client });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get client
router.get("/client/:id",  auth,async (req, res) => {
  const clientID = req.params.id;

  try {
    const client = await Client.findById(clientID);

    if (!client) {
      throw new Error("no_client");
    }

    res.status(200).send({ client });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(400).send({ message: "no client with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get client by name
router.get("/clientName/:name",  auth,async (req, res) => {
  const clientName = req.params.name.trim();

  try {
    const client = await Client.findOne({name: clientName});

    if (!client) {
      throw new Error("no_client");
    }

    res.status(200).send({ client });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(400).send({ message: "لا يوجد عميل بهذا الاسم" });
    } else {
      res.status(400).send({ message: "حدث خطء ما" });
    }
  }
});

router.get("/clientAccount/:id",  auth,async (req, res) => {
  const clientID = req.params.id;

  try {
    const chartAccount = await ChartAccount.findOne({
      accountRefId: clientID
    });

    if (!chartAccount) {
      throw new Error("no_client");
    }

    res.status(200).send({ chartAccount });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(400).send({ message: "لا يوجد حساب لهذا العميل" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// edit client
router.put("/client/:id",  auth,async (req, res) => {
  const clientID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "phone", "address", "amountDebit"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const client = await Client.findById(clientID);

    if (!client) {
      throw new Error("no_client");
    }

    updates.forEach((update) => {
      client[update] = req.body[update];
    });

    await client.save();

    res.status(200).send({ client });
  } catch (e) {
    console.log(e)
    if (e.code === 11000) {
      res.status(400).send({ message: "this client name already exist" });
    } else if (e.message === "no_client") {
      res.status(400).send({ message: "no client with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// delete client
router.delete("/client/:id/",  auth,async (req, res) => {
  const clientID = req.params.id;

  try {
    await Client.findByIdAndDelete(clientID);
    const client = await Client.find({}).sort({ name: 1 });
    res.status(200).send({ client });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// delete clients
router.delete("/clients",  auth,async (req, res) => {
  const clientsToDelete = req.body.Customers;
  console.log(clientsToDelete)
  try {
    for (let client of clientsToDelete) {
      await Client.findByIdAndDelete(client._id);
    }
    const clients = await Client.find({}).sort({ name: 1 });
    res.status(200).send({ clients });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;
