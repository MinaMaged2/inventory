const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const expenseHeaderSchema = new mongoose.Schema(
  {    
    description: {
      type: String,
      trim: true,
    },
    invoiceTotal: {
      type: Number,
      required: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    expenseTypeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpensesType",
    },
    expenseHeaderID: {
      type: Number,
      unique: true,
    },
    operationDate: {
      type: Date
    },
  },
  {
    timestamps: true,
  }
);

expenseHeaderSchema.plugin(AutoIncrement, { inc_field: "expenseHeaderID" });
const ExpenseHeader = mongoose.model("ExpenseHeader", expenseHeaderSchema);
module.exports = ExpenseHeader;
