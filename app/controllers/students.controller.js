const Student = require('../models/studentmodel');

exports.findAll = (req, res) => {
  Student.find((err, data) => {
    if (err) {
      res.status(500).send({ error: 'some error occurred while retrieving students' });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  console.log('searching one student');
  if (!req.params) {
    return res.send('Field can not be empty');
  }
  Student.findById(req.params.studentId, (err, data) => {
    if (err) {
      res.send({ error: 'some error occurred while retrieving the student' });
    } else {
      res.send(data);
    }
  });
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.send('You send me empty data');
  }
  const newStudent = new Student({
    name: req.body.name,
    age: req.body.age,
    subjects: req.body.subjects,
    address: { street: req.body.street, postal: req.body.postal, city: req.body.city },
    gender: req.body.gender,
  });
  newStudent.save((err) => {
    if (err) {
      throw err;
    }
  });
  res.send({ message: `Student ${newStudent.name} has been saved successfully` });
};

exports.update = (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
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
    });
  });
  res.json({ message: `student has been update successfully` });
};

exports.delete = (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  Student.findById(req.params.studentId, (err, student) => {
    student.remove((err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.json({ message: `student has been deleted successfully` });
};

exports.searchText = (req, res) => {
  Student.find({ $or: [{ 'name': req.params.data }, { 'gender': req.params.data }, { 'subjects': req.params.data }] }, (err, student) => {
    if (err) {
      throw err;
    }
    if (student[0] !== undefined) {
      res.json(student);
    } else {
      res.send({ error: 'What you search is not in the database' });
    }
  });
}

exports.searchNumbers = (req, res) => {
  Student.find({ 'age': req.params.data }, (err, student) => {
    if (err) {
      throw err;
    }
    if (student[0] !== undefined) {
      res.json(student);
    } else {
      res.send({ error: 'What you search is not in the database' });
    }
  });
}