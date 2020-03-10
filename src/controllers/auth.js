
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/auth');

const router = express.Router();
const db = require('../../models');

const { Op } = db.Sequelize;
router.post('/', async (req, res) => {
  try {
    const userExists = await db.user.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.sendStatus(401);
    }

    await db.user.create(req.body);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserValid = await db.user.findOne({ where: { email }, raw: true });
    if (!isUserValid) {
      return res.sendStatus(401);
    }

    const isPasswordValid = await bcrypt.compare(password, isUserValid.password);
    if (!isPasswordValid) {
      return res.sendStatus(401);
    }


    let token = jwt.sign({ id: isUserValid.id }, process.env.JWT_KEY);
    token = `Bearer ${token}`;

    const name = `${isUserValid.title}
  ${isUserValid.firstName} ${isUserValid.lastName}`;

    return res.status(200).json({ token, role: isUserValid.role, name });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    await db.user.update(req.body, {
      where: {
        id,
      },
      transaction,
    });
    // ADD AUDIT
    await db.audit.create({
      action: 'Update',
      area: 'user',
      description: `Updated in ${id}`,
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

router.put('/status', checkAuth, async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, status } = req.body;

    await db.user.update({
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
      area: 'user',
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


router.get('/', async (req, res) => {
  try {
    const data = await db.user.findAll({
      where: {
        email: {
          [Op.ne]: 'admin@system.com',
        },
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/:id', checkAuth, async (req, res) => {
  try {
    const data = await db.user.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/me', checkAuth, async (req, res) => {
  try {
    const data = await db.User.findById(req.user.id);


    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});


router.post('/forgotPassword', async (req, res) => {
  try {
    //  check email exists
    const user = await db.User.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(401);
    }


    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
