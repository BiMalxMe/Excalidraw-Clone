import { NextFunction,Response ,Request} from "express"
import  Jwt  from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const middleware = (req : Request, res :Response, next : NextFunction) => {
    const token = req.headers["authorization"];

    const decoded = Jwt.verify(token,JWT_SECRET);

    if(decoded){
            req.userId = decoded.userId;
    }else{
        res.json({msg:"Unauthorized"})
    }
}