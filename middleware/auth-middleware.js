import { httpCodes } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
// import jwt from "jsonwebtoken"
import jwt  from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../prisma/index.js";
const verfiyToken = async (secret, token) => {
    return await jwt.verify(token,secret)
 }

const authenticate = async (req, res, next) => {
    
    console.log("authenticating user");
    const authHeader = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;
    
    if (!authHeader) {
        console.log("unauthorized user in auth middleware");
        req.user=await prisma.user.findFirst({where:{id:44}})

        return res.status(httpCodes.unauthorized).json(new ApiResponse(httpCodes.unauthorized,{},"please login first"))
        next()
        throw new ApiError(httpCodes.unauthorized, "user is not authenticated");
        return;
    }
    const token = authHeader.split(' ')[1];
    const payload = await verfiyToken(process.env.ACCESS_TOKEN_SECRET, token || authHeader);
    req.user = payload;
    console.log("user authenticated");
    next();

}
export { authenticate };