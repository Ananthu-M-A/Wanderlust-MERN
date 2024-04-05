import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import '../../../index.css';
import ChatWindow from '../../../components/ChatWindow';

const socket = io('http://localhost:4000');

const Help = () => {
    const [name, setName] = useState<string>("DemoUser");
    const [roomId, setRoomId] = useState<string>("DemoRoomID");

    useEffect(() => {
        if (name !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
        }
    },[socket]);

    return (
        <div className="flex flex-col h-screen justify-center items-center bg-blue-100 rounded">
            <ChatWindow socket={socket} name={name} roomId={roomId} />
        </div>
    );
}
export default Help;
