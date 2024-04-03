import { Server } from "socket.io";

const createServer = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User Connected; Socket ID: ${socket.id}`);

        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`User with ID: ${socket.id} Joined Room: ${roomId}`);
        });

        socket.on("send_message", (messageData) => {
            io.to(messageData.roomId.toString()).emit("received_message", messageData);
        });

        socket.on('disconnect', () => {
            console.log(`User Disconnected; Socket ID: ${socket.id}`);
        });
    });
}

export default createServer;
