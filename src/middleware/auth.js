require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    let accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken && req.cookies) {
        accessToken = req.cookies.accessToken;
    }
    if (!accessToken) {
        console.log('Không tìm thấy Access Token, đang thử Refresh Token...');
        return handleRefreshToken(req, res, next); // Chuyển giao nhiệm vụ cho hàm refresh
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('User decoded from access token:', decoded); // Debug log
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            console.log('Access Token hết hạn/không hợp lệ, đang thử Refresh Token...');
            return handleRefreshToken(req, res, next); // Chuyển giao nhiệm vụ
        }
        return res.status(401).json({ error: 'Lỗi xác thực không xác định' });

    }
}

const handleRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    // Nếu không có cả Refresh Token -> Hết cứu!
    if (!refreshToken) {
        // Nếu đây là API request, trả về JSON
        if (req.header('Accept')?.includes('application/json')) {
            return res.status(401).json({ error: 'Yêu cầu xác thực. Vui lòng đăng nhập lại.' });
        }
        // Nếu đây là request từ trình duyệt (render web), chuyển hướng về trang login
        return res.redirect('/login');
    }

    // Thử xác thực Refresh Token
    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decodedRefresh.userId);
        if (!user) {
            return res.status(403).json({ error: 'Người dùng không tồn tại hoặc đã bị xóa.' });
        }

        // Tạo một Access Token MỚI
        const newAccessToken = jwt.sign(
            { userId: user._id, name: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Đặt lại cookie accessToken trong response
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true
        });

        // Gắn thông tin user vào request để route tiếp theo có thể sử dụng
        req.user = user;

        console.log('User from refresh token:', req.user); // Debug log
        // console.log('Refresh Token thành công, đã tạo Access Token mới.');

        // Đi tiếp tới route cần bảo vệ
        return next();

    } catch (err) {
        // Nếu Refresh Token cũng không hợp lệ (hết hạn, bị giả mạo)
        // console.log('Refresh Token không hợp lệ.');

        // Xóa các cookie hỏng
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // Phản hồi tương tự như trên
        if (req.header('Accept')?.includes('application/json')) {
            return res.status(403).json({ error: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' });
        }
        return res.redirect('/login');
    }
}

module.exports = authMiddleware;