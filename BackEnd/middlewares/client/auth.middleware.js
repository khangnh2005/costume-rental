const User = require('../../models/client/user.model');

module.exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.query.tokenUser;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục!',
      });
    }

    const user = await User.findOne({
      tokenUser: token,
      deleted: false,
      status: 'active',
    }).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực người dùng: ' + error.message,
    });
  }
};
