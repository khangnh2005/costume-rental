const User = require('../../models/client/user.model');

// [POST] /client/auth/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Họ và tên không được để trống',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email không được để trống',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không được để trống',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Kiểm tra email đã tồn tại hay chưa
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
      deleted: false,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng. Vui lòng chọn email khác!',
      });
    }

    const newUser = new User({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      address: address ? address.trim() : '',
      role: 'client',
      status: 'active',
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        tokenUser: newUser.tokenUser,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trên hệ thống: ' + error.message,
    });
  }
};

// [POST] /client/auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu',
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      deleted: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống!',
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không chính xác!',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đang bị khóa!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        tokenUser: user.tokenUser,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trên hệ thống: ' + error.message,
    });
  }
};

// [GET] /client/auth/user-info (Lấy thông tin khi quay lại trang bằng tokenUser)
module.exports.getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.tokenUser;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng cung cấp token đăng nhập!',
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
        message: 'Token không hợp lệ hoặc tài khoản đã bị khóa!',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trên hệ thống: ' + error.message,
    });
  }
};
