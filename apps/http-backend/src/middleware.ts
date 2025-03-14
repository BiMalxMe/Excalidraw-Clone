import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import{JWT_SECRET} from "@repo/backend-common/config"
export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded) {
    // @ts-ignore
    req.userId = decoded.userId;
    next()
  } else {
    res.json({ msg: "Unauthorized" });
  }
};
