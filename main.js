const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
const router = express.Router();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use("/", router);
// app.use('/assets', express.static('app/views/assets'));
const path = require('path');
app.use('/assets', express.static(path.join(__dirname, 'app/views/assets')));

// Configuring the database connection
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

mongoose.connection.on('error', () => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', () => {
  console.log("Successfully connected to the database");
})

const student = require('./app/controllers/students.controller.js');


// define a simple route
router.get('/api', (req, res) => {
  res.json({ "message": "Welcome to Students application REST-ful API. Organize and keep track of all your students!" });
});

// Create a new student
router.post('/api/student', student.create);

// Retrieve all students
router.get('/api/students', student.findAll);

// Retrieve a single student with studentId
router.get('/api/student/:studentId', student.findOne);

// Update a student with studentId
router.put('/api/student/:studentId', student.update);

// Delete a student with studentId
router.delete('/api/student/:studentId', student.delete);

// Seach the students by Text
router.get('/api/searchText/:data', student.searchText);

// Seach the students by Numbers
router.get('/api/searchNumbers/:data', student.searchNumbers);


// Web
router.get("/", (req, res) => {
  res.sendFile('index.html', { root: 'app/views' })
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
