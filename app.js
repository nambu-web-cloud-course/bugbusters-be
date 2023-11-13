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

// socket 연결
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // 방 입장 - join_room
  // socket.join으로 해서 계속 연결이 안 됐음
  socket.on("join_room", (data) => {
    const { userid, room, rid, req_userid } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room
    console.log("💬: join_room", data);
    const createdAt = Date.now();

    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${userid} has joined the chat room`,
      userid: BUSTER_BOT,
      createdAt,
    });

    // Send welcome msg to user that just joined chat only
    // 구현 완료
    socket.emit("receive_message", {
      message: `Welcome ${userid}`,
      userid: BUSTER_BOT,
      createdAt,
      room: room,
    });

    // Save the new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, userid, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });

  // 메시지 전송 - send_message
  socket.on("send_message", (data) => {
    const { message, userid, room, createdAt } = data;
    io.in(room).emit("receive_message", data); // Send to all users in room, including sender
  });

  // 타이핑 - typing
  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  // 방 나가기 - leave_room
  socket.on("leave_room", (data) => {
    const { userid, room } = data;
    socket.leave(room);
    const createdAt = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      userid: CHAT_BOT,
      message: `${userid} has left the chat`,
      createdAt,
    });
    console.log(`${userid} has left the chat`);
  });

  // 뭔지 찾아봐야 함
  socket.leave("join_room");

  // 연결 끊기 - disconnect
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.userid) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.userid} has disconnected from the chat.`,
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
