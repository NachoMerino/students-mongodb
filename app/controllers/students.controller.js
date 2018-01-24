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

exports.find = (req, res) => {
  Student.findById(req.params.studentsid, (err, student) => {
    res.send(student);
  });
};

exports.create = (req, res) => {
  console.log('creating new student');
  const newStudent = new Student({
    name: req.body.studentName,
    age: req.body.studentAge,
    subjects: [req.body.sub1, req.body.sub2, req.body.sub3],
    address : { street: req.body.street, postal: req.body.postal, city: req.body.city },
    gender: req.body.studentGender,
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
  console.log('Going to edit', req.params.studentsid);
  Student.findById(req.params.studentsid, (err, student) => {
    student.name = req.body.studentName;
    student.age = req.body.studentAge;
    student.gender = req.body.studentGender;
    student.address = { street: req.body.street, postal: req.body.postal, city: req.body.city };
    student.subjects = [req.body.sub1, req.body.sub2, req.body.sub3];

    student.save((err) => {
      if (err) {
        throw err;
      }
      console.log(`student ${req.body.studentName} updated`);
    });
  });
  res.json({ message: `student ${newStudent.name} has been update successfully` });
};

exports.delete = (req, res) => {
  Student.findById(req.params.studentsid, (err, student) => {
    student.remove((err) => {
      if (err) {
        throw err;
      }
      console.log('student deleted with id:', req.params.studentsid);
    });
  });
  res.json({ message: `student has been deleted successfully` });
};
