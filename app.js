/* eslint-disable no-console */
const express = require('express');

const app = express();
const cors = require('cors');
const Sequelize = require('sequelize');

app.use(cors());
const morgan = require('morgan');

app.use(morgan('dev'));
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const routes = require('./src/controllers/index');

routes.forEach(([name, handler]) => app.use(`/${name}`, handler));

const port = process.env.PORT || 5000;

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
  host: 'localhost',
  dialect: process.env.DIALECT,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
app.listen(port, () => {
  console.log(`Server started on port, ${port}`);
});
