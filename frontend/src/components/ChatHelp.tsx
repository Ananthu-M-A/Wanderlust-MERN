import io from 'socket.io-client';
import '../index.css';
import { useState } from 'react';
import Chat from './Chat';

const socket = io('http://localhost:4000');

const ChatHelp = () => {
    const [name, setName] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [showChat, setShowChat] = useState<boolean>(false);

    const joinRoom = () => {
        if (name !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
            setShowChat(true);
        }
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center ">
            {!showChat ?
                (<>
                    <div className="text-2xl border-b p-4 font-bold">Chat Room Login</div>
                    <input className='border-2 rounded py-2 justify-center flex mb-2'
                        type='text' placeholder='  Enter Name...' onChange={(e) => setName(e.target.value)} />
                    <input className='border-2 rounded py-2 justify-center flex mb-2'
                        type='text' placeholder='  Enter Room ID...' onChange={(e) => setRoomId(e.target.value)} />
                    <button className='bg-blue-200 p-2 mb-3 rounded font-semibold'
                        onClick={joinRoom}>Join Room</button>
                </>) :
                (<Chat socket={socket} name={name} roomId={roomId} />)
            }
        </div>
    );
}
export default ChatHelp;
