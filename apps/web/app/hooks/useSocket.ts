import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export  function useSocket(){
    const [loading,setloading] = useState(true);
    const [socket,setsocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}/token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjOGJlYzQ3NC0wYWUwLTQ2MzktYmE0Ny02Yzk5ODJmNWI5Y2YiLCJpYXQiOjE3NDIwOTMxNTJ9.jQsGdhmW5HKcToh8vkSomIBBTnIyXtdXzTLEMOVeV6Y`)
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