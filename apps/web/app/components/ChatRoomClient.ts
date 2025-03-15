
"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

export function ChatRoomClient({
    message,
    id
} : {
    message :{message : string}[],
    id : string
}){
    const [socket,loading] = useSocket();
    const [chats,setchats] = useState(message)

    useEffect(() => {
        if(socket && !loading){
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setchats( chat => [...chat,parsedData.message])
                }
            }
        }
    },[])

}