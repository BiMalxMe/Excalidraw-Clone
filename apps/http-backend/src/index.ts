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
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
     res.json({ message: "Incorrect Inputs" });
     return;
  }

  const existingUser = await prismaClient.user.findUnique({
    where: { email: parsedData.data.email },
  });

  if (!existingUser) {
    try {
      await prismaClient.user.create({
        data: {
          email: parsedData.data?.email,
          password: parsedData.data?.password,
          name: parsedData.data?.name,
        },
      });
       res.json({ message: "User Signed Up" });
       return;
    } catch (error) {
       res.json({ message: "An Error Occurred" });
       return;
    }
  }

   res.json({ message: "User already exists" });
   return;
});

  //This code is written while checking the database functioningg
  
//   const parsedData = req.body
//   await prismaClient.user.create({
// data : {
//   name : parsedData.name,
//   email : parsedData.email,
//   password : parsedData.password
// }
//   })
//   res.json({
//     msg : "Message Created Sucessfully"
//   })


app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect Options",
    });
    return;
  }
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data?.email,
        password: parsedData.data?.password,
      },
    });
    if (!user) {
      res.status(403).json("User Doesnot exists");
    }
    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "An Error Occurred",
    });
  }
});
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inpputss",
    });
    return;
  }
  //Now the database calls
  // @ts-ignore
  const userId = req.userId;
  await prismaClient.room.create({
    data: {
      slug: parsedData.data.name,
      adminId: userId,
    },
  });
  res.json({
    roomId: 123,
  });
});

app.listen(3000);
