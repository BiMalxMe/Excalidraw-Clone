

import { WebSocketServer } from "ws";
const wss = new WebSocketServer({port : 8080});

wss.on("message", function message(data){
    console.log("Received %s ",data)
});
