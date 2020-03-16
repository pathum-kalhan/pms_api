const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'job';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    // CHECK JOB EXISTS
    const isExists = await db.job.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (isExists) {
      await transaction.commit();
      return res.status(422).json('Job already exists!');
    }
    const data = await db[modelName].create(req.body, { transaction });

    await db.audit.create({
      area: 'job',
      action: 'Create',
      description: `Add job in ${data.dataValues.id}`,
      userId: req.user.id,
      refId: data.dataValues.id,
    }, { transaction });
    await transaction.commit();

    return res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    return res.sendStatus(500);
  }
});

router.get('/', checkAuth, async (req, res) => {
  try {
    const data = await db[modelName].findAll();
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});


router.get('/:id', checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db[modelName].findOne({
      where: {
        id,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, status } = req.body;

    await db[modelName].update({
      status,
    }, {
      where: {
        id,
      },
      transaction,
    });

    // ADD AUDIT
    await db.audit.create({
      action: 'Update',
      area: 'job',
      description: `Updated status to ${status} in ${id}`,
      userId: req.user.id,
      reference: id,
    }, { transaction });
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    await db[modelName].update(req.body, {
      transaction,
      where: {
        id,
      },
    });

    await db.audit.create({
      area: 'job',
      action: 'Update',
      description: `Update job in ${id}`,
      userId: req.user.id,
      refId: id,
    }, { transaction });

    await transaction.commit();

    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();

    res.sendStatus(500);
  }
});

module.exports = router;
