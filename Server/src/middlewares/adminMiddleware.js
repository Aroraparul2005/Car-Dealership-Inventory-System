import ApiError from "../utils/apiHandeller";

const adminMiddleware=(req,res,next)=>{
    if(!req.user){
        return next(new ApiError(401,'Authentication required'));
    }
    if(req.user.role!=='Admin'){
        return next(new ApiError(401,'Authentication required'));
    }
    next();

};

export default adminMiddleware;