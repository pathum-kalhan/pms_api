const express = require('express');

const router = express.Router();
const db = require('../../models');
const checkAuth = require('../middleware/auth');

const modelName = 'item';

router.post('/', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    // CHECK ATTENDANCE MARKED ALREADY
    const isExists = await db.item.findOne({
      where: {
        name: req.body.name,
        unit: req.body.unit,

      },
    });

    if (isExists) {
      await transaction.commit();
      return res.status(422).json('Item already exists!');
    }
    const data = await db[modelName].create(req.body, { transaction });

    await db.audit.create({
      area: 'item',
      action: 'Create',
      description: `Add item in ${data.dataValues.id}`,
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
    const data = await db[modelName].findAll({
      attributes: ['name', 'id', 'status', 'description', 'unit', 'createdDate', 'updatedDate'],
    });
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
      area: 'item',
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
      area: 'item',
      action: 'Update',
      description: `Update item in ${id}`,
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
