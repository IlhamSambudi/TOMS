import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token tidak ditemukan.',
            data: null,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kadaluwarsa.',
            data: null,
        });
    }
};
