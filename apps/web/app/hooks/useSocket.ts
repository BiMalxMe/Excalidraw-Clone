import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading,setloading] = useState(true);
    const [socket,setsocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(WS_URL)
        ws.onopen = () => {
            setloading(false);
            setsocket(ws);
        }
    },[])
    return {
        socket,
        loading
    }
}