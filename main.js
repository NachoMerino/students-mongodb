const mongoose = require('mongoose');
const express = require('express');

// create the app
const app = express();
const Router = express.Router;

const path = require('path');
const frontendDirectoryPath = path.resolve(__dirname, './app/views');
app.use(express.static(frontendDirectoryPath));

// always want to have /api in the begining
const apiRouter = new Router();
app.use('/api', apiRouter);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Student = require('./app/models/studentmodel');
const port = 9090;

mongoose.connect('mongodb://localhost/test');
// close if DB is not online
mongoose.connection.on('error', () => {
  console.log('could not conect to DB, exiting now');
  process.exit();
})

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
})

const student = require('./app/controllers/students.controller.js');
// router.post('/api/student', student.create);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'app/views' });
});

apiRouter.get('/', (req, res) => {
  res.send({ 'mongoDB-CRUD-API': '1.0' });
});

// read statement
apiRouter.get('/student/:studentsid', student.find);
apiRouter.get('/students', student.findAll);

// create statement
apiRouter.post('/create', student.create);

// update statement
apiRouter.put('/update/:studentsid', student.update);

// DELETE statement
apiRouter.delete('/delete/:studentsid', student.delete);

apiRouter.get("*", (req, res) => {
  res.send('404 Sorry we couldnt find what you requested');
});

app.listen(port, (err) => {
  if (err) throw err;
  console.info('Server started on port', port);
});
