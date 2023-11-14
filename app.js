const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Chat Setting
const BUSTER_BOT = "BugBusters_Official";
const leaveRoom = (userID, chatRoomUsers) => {
  return chatRoomUsers.filter((user) => user.id != userID);
};
let allUsers = [];
let chatRoomMessages = [];
// Chat Setting

dotenv.config();
const sync = require("./models/sync.js");
sync();
const port = process.env.PORT || 3000;
const app = express();
const auth_router = require("./routes/auth_router.js");
const trade_router = require("./routes/trade_router.js");
const request_router = require("./routes/request_router.js");
const image_router = require("./routes/image_router.js");
const { addHook } = require("./models/User.js");

// socket server
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);

// create socketIO instance
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin:http://localhost:3000"],
  },
});

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`🅾️  User connected ${socket.id}`);

  // ✅ Add a user to a room 
  socket.on("join_room", (data) => {
    const { username, req_userid, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room
    console.log(`🦋 Buster: ${username}, User: ${req_userid}, Room: ${room}`)
    
    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: BUSTER_BOT,
      __createdtime__,
    });

    // ✅ Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      message: `${username} requested to ${req_userid}`,
      username: BUSTER_BOT,
      __createdtime__,
    });

    // ✅ Save the new user to the room
    // 현재는 1개의 요청 목록에 방이 여러 개 생김 -> 중복 제거
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    console.log("chatroom_users", chatRoomUsers)

    // 나중에 DB에 저장한 후 최근 메시지 100개(지정 필요)만 불러오기
    // Get last 100 messages sent in the chat room
    // socket.on("get_last_100_messages", (data) => {
    //   console.log("get_last_100_messages", data)
    //   socket.emit("last_100_messages", chatRoomMessages.slice(-100));
    // });

  });

  socket.on("send_message", (data) => {
    console.log("send_message", data)
    const { message, username, room, __createdtime__ } = data;
    const newMessage = { message, username, __createdtime__ };
    chatRoomMessages.push(newMessage);
    io.in(room).emit("receive_message", newMessage);
    console.log("chatRoomMessages", chatRoomMessages)
  });

  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    console.log("💧 User leaves the room")
    const __createdtime__ = Date.now();
    // Remove user from memory
    // 방 나가기를 한 유저에게만 채팅목록 사라지게 하기
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: BUSTER_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected from the chat");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

// const isAuth = require('./routes/authorization.js');
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("hello");
});

//cookie 에서 토큰 검사
// app.get('/', (req, res)=> {
//     if(req.cookies.token) {
//         console.log(req.cookies.token);
//     } else {
//         res.cookie('id', 'bomnamu', {
//             maxAge:10000000,
//             httpOnly: true, //브라우저에서만 사용가능 (node, rest api 에서 사용 불가)

//         })
//         res.send('Hello cookies');

//     }
// });

// app.use('/posts', isAuth,  trade_router);
app.use("/image", image_router);
app.use("/request", request_router);
app.use("/trade", trade_router);
app.use("/auth", auth_router);
// app.listen(port);

// socket 실행
server.listen(port, () => {
  console.log(`Socket IO server listening on port ${port}`);
});
