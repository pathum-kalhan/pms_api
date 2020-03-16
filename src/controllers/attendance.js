const express = require('express');

const moment = require('moment');

const router = express.Router();
const checkAuth = require('../middleware/auth');
const db = require('../../models');

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // CHECK ATTENDANCE MARKED ALREADY
    const isMarked = await db.attendance.findOne({
      where: {
        userId: req.body.userId,
        attendanceDate: req.body.attendanceDate,
        site: req.body.site,
      },
    });

    if (isMarked) {
      await transaction.commit();
      return res.status(422).json('Already marked for this user!');
    }

    const data = await db.attendance.create(req.body, { transaction });

    // ADD AUDIT
    await db.audit.create({
      action: 'Mark',
      area: 'attendance',
      description: `Marked in ${data.dataValues.id}`,
      userId: req.user.id,
      reference: data.dataValues.id,
    }, { transaction });
    await transaction.commit();

    return res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    return res.sendStatus(500);
  }
});

function mapHoursDiff(element) {
  const e = element;
  e.checkIn = (moment(e.checkIn, 'HHmm').format('hh:mm A'));
  e.checkOut = (moment(e.checkOut, 'HHmm').format('hh:mm A'));
  e.fullName = `${e['user.title']} ${e['user.firstName']} ${e['user.lastName']}`;
  return e;
}

router.get('/', checkAuth, async (req, res) => {
  try {
    let data = await db.attendance.findAll({
      raw: true,
      include: [{
        model: db.user,
        attributes: ['title', 'firstName', 'lastName', 'fullName'],
      }],
      order: [['id', 'DESC']],
      limit: 100,
    });
    data = data.map(mapHoursDiff);


    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const data = await db.attendance.findOne();

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    await db.attendance.update(req.body, {
      where: {
        id: req.params.id,
      },

      transaction,
    });

    // ADD AUDIT
    await db.audit.create({
      action: 'Update',
      area: 'attendance',
      description: `Updated in ${req.params.id}`,
      userId: req.user.id,
      reference: req.params.id,
    }, { transaction });
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500);
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    await db.attendance.destroy({
      where: {
        id: req.params.id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.audit.create({
      action: 'Delete',
      area: 'attendance',
      description: `Deleted in ${req.params.id}`,
      userId: req.user.id,
      reference: req.params.id,
    }, { transaction });
    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});


module.exports = router;
