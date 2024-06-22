const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
  },
  employeeID: {
    type: Number,
    unique: true
  }

});

employeeSchema.plugin(AutoIncrement,  {inc_field: 'employeeID'} );
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;