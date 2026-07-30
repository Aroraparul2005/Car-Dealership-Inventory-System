import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiHandeller.js';

const authMiddleware=(req,res,next)=>{
    const auth=req.headers.authorization;

    if(!auth||!auth.startsWith('Bearer')){//startWith->startsWith
        return next(new ApiError(401,'No token provided'));
    }

    const token=auth.split(' ')[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(error){
        return next(new ApiError(401,'Invalid or expired token'));
    }
    
};

export default authMiddleware;