import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8180 });

interface User {
  ws: WebSocket;
  rooms: String[];
  userId: String;
}

const users: User[] = [];

function checkUser(token: string): null | string {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", async function connection(ws, request) {
  try {
    const url = request.url;

    if (!url) {
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";
    const userId = checkUser(token);

    if (userId == null) {
      ws.close();
      return null;
    }

    users.push({
      userId,
      rooms: [],
      ws,
    });

    ws.on("message", async function message(data) {
      try {
        const parsedData = JSON.parse(data as unknown as string);
        
        if (parsedData.type === "join_room") {
          try {
            const user = users.find((x) => x.ws == ws);
            if (user) {
              user.rooms.push(parsedData.roomId);
            }
          } catch (error) {
            console.error("Error in join_room:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to join room",
              })
            );
          }
        }

        if (parsedData.type === "leave_room") {
          try {
            const user = users.find((x) => x.ws === ws);
            if (!user) {
              return;
            }
            user.rooms = user.rooms.filter((x) => x === parsedData.room);
          } catch (error) {
            console.error("Error in leave_room:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to leave room",
              })
            );
          }
        }

        if (parsedData.type === "chat") {
          try {
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            console.log(roomId)
            console.log(message)
            await prismaClient.chat.create({
              data: {
                roomId,
                message,
                userId,
              },
            });

            users.forEach((user) => {
              try {
                if (user.rooms.includes(roomId)) {
                  user.ws.send(
                    JSON.stringify({
                      type: "chat",
                      message: message,
                      roomId,
                    })
                  );
                }
              } catch (error) {
                console.error("Error sending message to user:", error);
              }
            });
          } catch (error) {
            console.error("Error in chat handling:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Failed to send chat message",
              })
            );
          }
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });
  } catch (error) {
    console.error("Error in connection handler:", error);
    ws.close();
  }
});