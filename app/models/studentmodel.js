const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type : String },
  age: {type: Number},
  subjects: Array,
  gender: { type : String },
  updated: {type:Date, default:Date.now()},
  address: Schema.Types.Mixed
});
/*
studentSchema.pre('save', (next)=> {
  const currentDate = new Date();
  this.updated = currentDate;

  next();
});
*/

const Student = mongoose.model('students', studentSchema);
module.exports = Student;
