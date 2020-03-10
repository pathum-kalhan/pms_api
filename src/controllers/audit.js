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

module.exports = router;
