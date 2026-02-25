import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/authModel.js';

const AuthController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username dan password wajib diisi',
                    data: null,
                });
            }

            const user = await AuthModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah',
                    data: null,
                });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah',
                    data: null,
                });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login berhasil',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        full_name: user.full_name,
                        role: user.role,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },
};

export default AuthController;
