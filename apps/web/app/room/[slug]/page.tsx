import axios from "axios";
import { BACKEND_URL } from "../../config";

async function getRoomId(slug:string){
    axios.get(`${BACKEND_URL}/room/${slug}`)
}

export default async function ChatRoom({
    params
}: {
    params : {
        slug : string
    }
}){
    const slug = params.slug;
    const roomId = await getRoomId(slug)
}