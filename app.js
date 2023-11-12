const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const sync = require('./models/sync.js');
sync();
const port = process.env.PORT || 3000;
const app = express();
const auth_router = require('./routes/auth_router.js');
const trade_router = require('./routes/trade_router.js');
const request_router = require('./routes/request_router.js');
const { addHook } = require('./models/User.js');
// const isAuth = require('./routes/authorization.js');
app.use (morgan('dev'));
app.use (express.json());
app.use(cors({
    origin:'*',
}));
app.use (cookieParser());
// app.use('/', express.static('uploads'));

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
app.use('/request', request_router);
app.use('/trade', trade_router);
app.use('/auth', auth_router);
app.listen(port);