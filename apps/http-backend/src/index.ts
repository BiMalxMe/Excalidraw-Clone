
import express from "express";
import { middleware } from "./middleware";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client"
import { Request,Response } from "express";
const app = express();

app.post("/signup",async(req:Request,res:Response) => {
    const payload = req.body;
    const data = CreateUserSchema.safeParse(payload);
    if (!payload || !payload.username || !payload.password || !payload.name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    if(data.success){
        res.json({
            message : "Incorrect Options"
        })
        return;
    }
    
    await prismaClient.user.create({
        data: {
          name : payload.name,
          username : payload?.username ?? "Def",
          password : payload.password,
        }
      });
      

    //db call
    res.json({
        userId : "123"
    })
})
app.post("/signin",(req,res) => {
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect Options"
        })
        return;
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        token
    })
})
app.post("/room",middleware,(req,res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect Inpputss"
        })
        return
    }
    //Now the database calls

    res.json({
        roomId : 123
    })
})

app.listen(3000);