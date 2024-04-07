import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import '../../index.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const socket = io(API_BASE_URL);

const Chat = () => {
    const [name] = useState<string>("DemoAdmin");
    const [roomId] = useState<string>("ChatRoom");

    useEffect(() => {
        if (name !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
        }
    }, [socket]);

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-blue-100 rounded">
            <ChatWindow socket={socket} name={name} roomId={roomId} />
        </div>
    );
}
export default Chat;
