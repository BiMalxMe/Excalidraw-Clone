import axios from "axios"
import { BACKEND_URL } from "../config"


async function getChats(roomId : string){
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    return response.data.message
}

export async function ChatRoom({id}:{
    id :string
}){
    const messages = await getChats(id)
}