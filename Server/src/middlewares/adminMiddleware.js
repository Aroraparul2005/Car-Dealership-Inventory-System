import ApiError from "../utils/apiHandeller.js";

const adminMiddleware=(req,res,next)=>{
    if(!req.user){
        return next(new ApiError(401,'Authentication required'));
    }
    if(req.user.role!=='admin'){
        return next(new ApiError(401,'Authentication required'));
    }
    next();

};

export default adminMiddleware;