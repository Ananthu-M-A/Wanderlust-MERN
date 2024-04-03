import { useEffect, useState } from "react";

type Props = {
    socket: any;
    name: string;
    roomId: string;
}

type Message = {
    roomId: string;
    name: string;
    currentMessage: string;
    time: string;
}

function Chat({ socket, name, roomId }: Props) {
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageList, setMessageList] = useState<Message[]>([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData: Message = {
                roomId, name, currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
        }
    }

    useEffect(() => {
        socket.on("received_message", (receivedMessageData: Message) => {
            setMessageList((list) => [...list, receivedMessageData]);
        });
    }, [socket])

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex flex-col justify-between bg-gray-100">
                <div className="header bg-blue-500 text-white p-4">
                    Ask Me About Wanderlust
                </div>
                <div className="body flex-1">
                    {messageList.map((message) => {
                        return <div className="">
                            <h1>
                                {message.currentMessage}
                            </h1>
                        </div>
                    })}
                </div>
                <div className="footer bg-gray-200 p-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Ask me..."
                        className="flex-1 mr-2 border rounded px-4 py-2"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={sendMessage}
                    >
                        &#9658;
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Chat;
