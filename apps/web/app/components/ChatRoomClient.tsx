"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  message,
  id,
}: {
  message: { message: string }[];
  id: string;
}) {
  const [chats, setchats] = useState(message);
  const { socket, loading } = useSocket();
  const [currentMsg, setCurrentMsg] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setchats((chat) => [...chats, parsedData.message]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {message.map((c) => (
        <div>{c.message}</div>
      ))}
      <input
        value={currentMsg}
        type="text"
        onChange={e => {
          setCurrentMsg(e.target.value);
        }}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMsg,
            })
          );
          setCurrentMsg("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
