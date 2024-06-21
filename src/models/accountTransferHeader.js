const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const accountTransferHeaderSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    transferFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartAccount",
      required: true,
    },
    transferTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChartAccount",
      required: true,
    },
    accountTransferHeaderID: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

accountTransferHeaderSchema.plugin(AutoIncrement, { inc_field: "accountTransferHeaderID" });
const AccountTransferHeader = mongoose.model("AccountTransferHeader", accountTransferHeaderSchema);
module.exports = AccountTransferHeader;
