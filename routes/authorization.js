const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const secret = process.env.JWT_SECRET ;
const isAuth = async (req, res, next) => {

    // const auth = req.get('Authorization');   // header에서 토큰 가져오기
    const auth = req.cookies.token; //  cookies 에서 토큰 가져오기
    console.log('auth:',auth);
    if (!(auth && auth.startsWith('Bearer')))  {

        return res.send ({message:"Auth error."});
    }
    
    const token = auth.split (' ')[1]; // 앞에 bearer가 붙어 있어서.. 떼내기..
    jwt.verify (token, secret, (error, decoded)=>{
        if (error) {
            res.send ({message:"Auth error."});
        } else {
            const userid = decoded.uid;
            const role = decoded.rol;
            req.userid = userid;
            req.role = role;
            next();
        }
    })

};

module.exports = isAuth