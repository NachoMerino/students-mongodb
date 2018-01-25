const Student = require('../models/studentmodel');

exports.findAll = (req, res) => {
  Student.find((err, data) => {
    if (err) {
      res.status(500).send({ message: 'some error occurred while retrieving students' });
    } else {
      res.send(data);
    }
  })
};

exports.findOne = (req, res) => {
  console.log('finding student:', req.params.studentId);
  Student.findById(req.params.studentId, (err, student) => {
    res.send(student);
  });
};

exports.create = (req, res) => {
  if(!req.body){
    return res.send('some error occurred with req.body');
  }
  console.log('creating new student');
  const newStudent = new Student({
    name: req.body.name,
    age: req.body.age,
    subjects: req.body.subjects,
    address : { street: req.body.street, postal: req.body.postal, city: req.body.city },
    gender: req.body.gender,
  });
  newStudent.save((err) => {
    if (err) {
      throw err;
    }
    console.log(`user ${newStudent.name} has been saved successfully`);
  });
  res.send(`user ${newStudent.name} has been saved successfully`);
};

exports.update = (req, res) => {
  console.log('Going to edit', req.params.studentId);
  Student.findById(req.params.studentId, (err, student) => {
    student.name = req.body.name;
    student.age = req.body.age;
    student.gender = req.body.gender;
    student.address = { street: req.body.street, postal: req.body.postal, city: req.body.city };
    student.subjects = req.body.subjects;
    student.save((err) => {
      if (err) {
        throw err;
      }
      console.log(`student updated`);
    });
  });
  res.json({ message: `student has been update successfully` });
};

exports.delete = (req, res) => {
  console.log('deleting new student');
  Student.findById(req.params.studentId, (err, student) => {
    console.log(student);
    student.remove((err) => {
      if (err) {
        throw err;
      }
      console.log('student deleted with id:', req.params.studentId);
    });
  });
  res.json({ message: `student has been deleted successfully` });
};
