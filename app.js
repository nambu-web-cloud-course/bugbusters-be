const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();
const sync = require('./models/sync.js');
sync();
const port = process.env.PORT || 3000;
const app = express();
const auth_router = require('./routes/auth_router.js');
const trade_router = require('./routes/trade_router.js');
// const isAuth = require('./routes/authorization.js');
app.use (morgan('dev'));
app.use (express.json());

app.get('/', (req,res)=>{
    res.send("hello");
})
// app.use('/posts', isAuth,  trade_router);
app.use('/trades',trade_router);
app.use('/auth', auth_router);
app.listen(port);