const jwt = require('jsonwebtoken');
const db = require('../../models');


module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    // const { id } = req.user;

    // user.update({
    //   where: {
    //     id:null
    //   }
    // })
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
