
import express from "express";
import { middleware } from "./middleware";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();

app.post("/signup",(req,res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message : "Incorrect Options"
        })
        return;
    }

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