const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();
const sync = require('./models/sync.js');
sync();
const port = process.env.PORT || 3000;
const app = express();
const auth_router = require('./routes/auth_router.js');
const trade_router = require('./routes/trade_router.js');
const request_router = require('./routes/request_router.js');
const image_router = require('./routes/image_router.js');
const { addHook } = require('./models/User.js');

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

const CHAT_BOT = 'ChatBot';
// socket 연결
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('join_room', (data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room
  });


  let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
  socket.to(room).emit('receive_message', {
    message: `${username} has joined the chat room`,
    username: CHAT_BOT,
    __createdtime__,
  });
  // Send welcome msg to user that just joined chat only
  socket.emit('receive_message', {
    message: `Welcome ${username}`,
    username: CHAT_BOT,
    __createdtime__,
  });
  // Save the new user to the room
  chatRoom = room;
  allUsers.push({ id: socket.id, username, room });
  chatRoomUsers = allUsers.filter((user) => user.room === room);
  socket.to(room).emit('chatroom_users', chatRoomUsers);
  socket.emit('chatroom_users', chatRoomUsers);
  // // Listen for 'message' events
  // socket.on('message', (message) => {
  // // Broadcast the message to all connected clients
  //   io.emit('message', message);
  //   console.log(message)
  // });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });
});


// const isAuth = require('./routes/authorization.js');
app.use (morgan('dev'));
app.use (express.json());
app.use(cors({
    origin:'*',
}));
app.use (cookieParser());

app.use('/uploads', express.static('uploads'))

app.get('/', (req,res)=>{
    res.send("hello");
})


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
app.use ('/image', image_router);
app.use('/request', request_router);
app.use('/trade', trade_router);
app.use('/auth', auth_router);
// app.listen(port);

// socket 실행
server.listen(port, () => {
  console.log(`Socket IO server listening on port ${port}`);
});