import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import '../../index.css';

const socket = io('http://localhost:4000');

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
