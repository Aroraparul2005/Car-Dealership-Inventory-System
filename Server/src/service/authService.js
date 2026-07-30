import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import ApiError from '../utils/apiHandeller.js';


export const registerUser = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, 'A user with this email already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password_hash,
    role: role === 'admin' ? 'admin' : 'staff',    //if role is not specified then mark user
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };
};



export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password_hash');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  //Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};