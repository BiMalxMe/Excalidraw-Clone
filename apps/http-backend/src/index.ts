import express from "express";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import e from "express";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const payload = req.body;
  const parsedData = CreateUserSchema.safeParse(payload);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Options",
    });
    return;
  }
  const existingUser = prismaClient.user.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });
  if (!existingUser) {
    try {
      await prismaClient.user.create({
        data: {
          email: parsedData.data?.email,
          password: parsedData.data?.password,
          name: parsedData.data?.password,
        },
      });

      //db call
      res.json({
        message: "User Signed Up",
      });
    } catch (error) {
      message: "An Error Occurred";
    }
  }
  res.json({
    message: "An Error Occurred",
  });
});
app.post("/signin", async(req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect Options",
    });
    return;
  }
  try{
  const user = await prismaClient.user.findFirst({
    where : {
        email : parsedData.data?.email,
        password : parsedData.data?.password
    }
  }) ;
  if(!user){
    res.status(403).json("User Doesnot exists")
  }
  const token = jwt.sign(
    {
     userId : user?.id,
    },
    JWT_SECRET
  );

  res.status(200).json({
    token,
  });
}catch(error){
    res.status(400).json({
        message : "An Error Occurred"
    })
}
});
app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect Inpputss",
    });
    return;
  }
  //Now the database calls

  res.json({
    roomId: 123,
  });
});

app.listen(3000);
