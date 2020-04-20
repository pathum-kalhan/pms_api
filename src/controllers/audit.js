const express = require('express');


const router = express.Router();
const checkAuth = require('../middleware/auth');
const db = require('../../models');

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db.audit.findAll({
      include: [{
        model: db.user,
        attributes: ['title', 'firstName', 'lastName', 'fullName'],
      }],
      order: [['id', 'DESC']],
      limit: 100,
    });


    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post('/report', async (req, res) => {
  try {
    const {
      orderBy, from, to, ids,
    } = req.body;
    const query = `SELECT audits.*, CONCAT(users.title,' ',users.firstName,' ',
    users.lastName) AS fullName FROM
    audits INNER JOIN users ON audits.userId = users.id
    WHERE users.id IN (:ids) AND DATE(audits.createdAt) BETWEEN DATE(:from) AND
    DATE(:to) ORDER BY ${orderBy}`;

    const data = await db.sequelize.query(query,
      {
        replacements: { from, to, ids },
        logging: console.log,
        type: db.sequelize.QueryTypes.SELECT,
      });


    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
