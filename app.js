const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const saveMessage = require("./services/saveMessage.js");
const getMessages = require("./services/getMessages");
const setRoom = require("./services/setRoom");
const getRooms = require("./services/getRooms");
const isRoomExist = require("./services/isRoomExist.js");
const leaveRoom = require("./services/leaveRoom.js");

dotenv.config();
const sync = require("./models/sync.js");
sync();
const port = process.env.PORT || 3000;

const app = express();
const auth_router = require("./routes/auth_router.js");
const trade_router = require("./routes/trade_router.js");
const request_router = require("./routes/request_router.js");
const image_router = require("./routes/image_router.js");
const chat_router = require("./routes/chat_router.js");
const { addHook } = require("./models/User.js");

// mongodb
const mongodbUri = process.env.MSGDB_URL;

// Chat Setting
const BUSTER_BOT = "BugBusters_Official";

let allUsers = [];
let chatRoomMessages = [];

// socket server
const http = require("http");
const socketIO = require("socket.io");
const Room = require("./models/Room.js");

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
  // let  rooms = io.sockets.adapter.rooms;
  // console.log('rooms:', rooms);
  console.log(`🅾️  User connected ${socket.id}`);

  // ✅ Add a user to a room
  socket.on("join_room", (data) => {
    // usderid: 로그인한 본인의 아이디
    const { userid, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room
    console.log(`🦋 userid: ${userid}, Room: ${room}`);

    //룸 정보에서 reqid, userid, busterid 알기 위해 분리
    const roomarr = room.split("_");

    //db에 동일한 방이 없을 때만 db에 저장
    isRoomExist(room)
      .then((response) => {
        // console.log('isRoomExist:', response);
        if (!response) setRoom(room, roomarr[1], roomarr[2], roomarr[0]);
      })
      .catch((err) => console.log(err));

    // 방정보 넘겨주기? api로 넘겨주는데? 필요없는듯, 나중에 정리
    // getRooms()
    //   .then((rooms) => {
    //     console.log('latest rooms:', rooms);
    //     socket.emit('latest rooms', rooms);
    //   })
    //   .catch((err) => console.log(err));

    let createdAt = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    // socket.to(room).emit("receive_message", {
    //   message: `${userid}님이 채팅방에 접속했습니다.`,
    //   userid: BUSTER_BOT,
    //   createdAt,
    // });

    // ✅ Send welcome msg to user that just joined chat only
    // socket.emit("receive_message", {
    //   message: `${userid}님, 환영해요!`,
    //   userid: BUSTER_BOT,
    //   createdAt,
    // });

    // ✅ Save the new user to the room
    // 현재는 1개의 요청 목록에 방이 여러 개 생김 -> 중복 제거
    chatRoom = room;
    allUsers.push({ id: socket.id, userid, room });
    // 같은 방에 있는 사람들에게 메시지 전송
    chatRoomUsers = allUsers.filter((user) => user.room === room);

    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    // console.log("chatroom_users", chatRoomUsers)

    // Get last 100 messages sent in the chat room
    getMessages(room, 10)
      .then((messages) => {
        // console.log('latest messages:', messages);
        socket.emit("last_100_messages", messages);
      })
      .catch((err) => console.log(err));
  });

  //////////////////////// / 23.11.18~19
  // 결제 메시지 전송
  socket.on("request_payment", (data) => {
    const { userid, room, price } = data;
    const createdAt = Date.now();
    const paymentMessage = {
      userid: BUSTER_BOT,
      message: `${userid}님께서 결제를 요청했습니다.`,
      createdAt,
    };

    io.in(room).emit("receive_message", paymentMessage);

    saveMessage(paymentMessage.message, paymentMessage.userid, room)
      .then((response) => console.log("reqeust_payment:", response))
      .catch((err) => console.log(err));
  });

  // 거래 완료 메시지 전송
  socket.on("complete_trade", (data) => {
    const { userid, room } = data;
    const createdAt = Date.now();
    const completeMessage = {
      userid: BUSTER_BOT,
      message: `${userid}님께서 거래를 완료시켰습니다.
      깔~끔하게 처리가 되셨나요?`,
      createdAt,
    };

    io.in(room).emit("receive_message", completeMessage);

    saveMessage(completeMessage.message, completeMessage.userid, room)
      .then((response) => console.log("reqeust_payment:", response))
      .catch((err) => console.log(err));
  });

  // 주소 전송
  socket.on("send_address", (data) => {
    const { userid, room, address } = data;
    const createdAt = Date.now();
    const addressMessage = {
      userid: BUSTER_BOT,
      message: `${userid} 님의 상세주소입니다. ${address}`,
      createdAt,
    };

    io.in(room).emit("receive_message", addressMessage);

    // 저장은 안 함?
    saveMessage(addressMessage.message, addressMessage.userid, room)
      .then((response) => console.log("user_address:", response))
      .catch((err) => console.log(err));
  });
  //////////////////////////////////////////////////

  socket.on("send_message", (data) => {
    // console.log("send_message", data)
    const { message, userid, room, createdAt } = data;
    const newMessage = { message, userid, createdAt };
    chatRoomMessages.push(newMessage);
    io.in(room).emit("receive_message", newMessage);

    saveMessage(message, userid, room) // ==> db에서 데이터 생성 시간 자동 생성됨(넘겨줄 필요 없음)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on("leave_room", (data) => {
    const { userid, room } = data;
    socket.leave(room);
    console.log("💧 User leaves the room");
    const createdAt = Date.now();
    // Remove user from memory
    // 방 나가기를 한 유저에게만 채팅목록 사라지게 하기
    leaveRoom(userid, room).then(() => {
      leftUsers = allUsers.filter((user) => user.id != socket.id);
      // allUsers = leaveRoom(socket.id, allUsers);
      // socket.to(room).emit("chatroom_users", leftUsers);
      // console.log('allusers:', allUsers)
      // console.log('leaveroom:;', room);
      socket.to(room).emit("chatroom_users", leftUsers);
      const leavingMessage = {
        // socket.emit("receive_message", {
        userid: BUSTER_BOT,
        message: `${userid}님이 방을 나갔습니다.`,
        createdAt,
      };
      socket.to(room).emit("receive_message", leavingMessage);
      saveMessage(leavingMessage.message, leavingMessage.userid, room);
      console.log(`${userid}님이 방을 나갔습니다.`);
    });
  });

  // socket.on("disconnect", () => {
  //   console.log("❌ User disconnected from the chat");
  //   const createdAt = Date.now();
  //   const user = allUsers.find((user) => user.id == socket.id);
  //   if (user?.userid) {
  //     allUsers = leaveRoom(socket.id, allUsers);
  //     socket.to(chatRoom).emit("chatroom_users", allUsers);
  //     socket.to(chatRoom).emit("receive_message", {
  //       message: `${user.username} has disconnected from the chat.`,
  //       __createdtime__,
  //     });
  //   }
  // });
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
app.use("/chat", chat_router);
// app.listen(port);

// socket 실행
server.listen(port, () => {
  console.log(`Socket IO server listening on port ${port}`);
  // console.log('mongodburl', mongodbUri);
  mongoose.connect(mongodbUri, {}).then(console.log("Connected to MsgDB"));
});
