const express = require('express');
require('./db/mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


// load all routers
const productRouter = require('./routers/product');
const clientRouter = require('./routers/client');
const orderRouter = require('./routers/order');
const supplierRouter = require('./routers/supplier');
const inventoryMoveHeaderRouter = require('./routers/inventoryMoveHeader');
const stockMovementRouter = require('./routers/stockMovement');
const userRouter = require('./routers/user');
const storeRouter = require('./routers/store');
const invoiceHeaderRouter = require('./routers/invoiceHeader');
const purchaseHeaderRouter = require('./routers/purchaseHeader');
const dailyJournalRouter = require('./routers/dailyJournal');
const productPerStoreRouter = require('./routers/productPerStore');
const chartAccountsRouter = require('./routers/chartAccounts');
const settingRouter = require('./routers/settings');
const bankInvoiceRouter = require('./routers/bankInvoice');
const bankRouter = require('./routers/bank');

// connected port
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// use our routers
app.use(productRouter);
app.use(clientRouter);
app.use(orderRouter);
app.use(supplierRouter);
app.use(inventoryMoveHeaderRouter);
app.use(stockMovementRouter);
app.use(userRouter);
app.use(storeRouter);
app.use(invoiceHeaderRouter);
app.use(purchaseHeaderRouter);
app.use(dailyJournalRouter);
app.use(productPerStoreRouter);
app.use(chartAccountsRouter);
app.use(settingRouter);
app.use(bankInvoiceRouter);
app.use(bankRouter);


app.listen(port, ()=> {
  console.log("server is running " + port)
})