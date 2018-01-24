const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  age: Number,
  subjects: Array,
  gender: String,
  updated: Date,
  address: Schema.Types.Mixed
});

studentSchema.pre('save', (next)=> {
  const currentDate = new Date();
  this.updated = currentDate;

  next();
});

const Student = mongoose.model('students', studentSchema);
module.exports = Student;
