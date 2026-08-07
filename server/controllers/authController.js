import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_complaint_key_2026_jwt_token',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Default self-registered users to USER unless created by Admin
    const userRole = role && ['USER', 'AGENT', 'ADMIN'].includes(role) ? role : 'USER';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      department: department || 'General Support',
      phone: phone || '',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
