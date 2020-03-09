
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

    return res.status(200).json({ token, role: isUserValid.role, name: isUserValid.fullName });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.put('/', checkAuth, async (req, res) => {
  try {
    const {
      title, firstName, lastName,
    } = req.body;
    await db.User.findOneAndUpdate({ _id: req.user.id }, {
      title, firstName, lastName,
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put('/updateStatus', checkAuth, async (req, res) => {
  try {
    const { _id, status } = req.body;

    const User = await db.User.findOne({ _id: req.user.id, $or: [{ status: 'verified' }, { status: 'pending' }] });
    if (!User) {
      return res.status(422).json('Admin user not found.');
    }
    const { role } = User;
    if (role === 'partner') {
      // He can change status only for his staff;
      await db.User.findOneAndUpdate({ partnerId: req.user.id, _id }, { status });
    }
    if (role === 'admin') {
      await db.User.findOneAndUpdate({ _id }, { status });
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
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
