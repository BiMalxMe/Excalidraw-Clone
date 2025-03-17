import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export  function useSocket(){
    const [loading,setloading] = useState(true);
    const [socket,setsocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}/token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNzQ1YTZiOS0wN2FmLTQ0NTktYTVmYi0wYmZiYjRhMWRkYjMiLCJpYXQiOjE3NDIxODA2NzJ9.1OouJiTn1CTGopKiyIePggq0PHBOUN-jcDKiU-yNHpI`)
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