import asyncHandeler from '../utils/asyncHandeller.js';
import ApiError from '../utils/apiHandeller.js';
import { registerUser, loginUser } from '../service/authService.js';

export const register = asyncHandler(async (req, res) => {
  const {name,email,password,role } = req.body;

  if(!name||!email||!password) {
    throw new ApiError(400, 'name, email, and password are required');
  }

  const response=await registerUser({name,email,password,role });
  res.status(201).json(result);
});


export const login =asyncHandler(async (req, res)=>{
  const {email,password}=req.body;

  if(!email||!password){
    throw new ApiError(400,'email and password are required');
  }

  const response = await loginUser({ email, password });
  res.status(200).json(result);
});