import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

const rooms: Record<string, string[]> = {};
const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        // Logic to create a room
        const roomId = UUIDv4();
        socket.join(roomId);

        rooms[roomId] = [];

        socket.emit("room-created", { roomId });
        console.log(`Room created with ID: ${roomId}`);
    };

    //peerjs --port 9000 --key peerjs --path /myapp  to run peerjs server


    const joinedRoom = ({roomId, peerId}: IRoomParams) => {
        if (rooms[roomId]) {
            console.log("New user joined room: ", roomId, " with peerId: ", peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);

            socket.on("ready", () => {
                socket.to(roomId).emit("user-joined", {peerId});
            })

            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId],
            });
        }
    };

    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);

};

export default roomHandler;