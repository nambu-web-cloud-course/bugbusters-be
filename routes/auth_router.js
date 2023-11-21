const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const isAuth = require('./authorization.js');

const { User } = require("../models");
const { Buster } = require("../models");
const { Trade } = require("../models");
const { busterreviewviews } = require("../models");
const router = express.Router();

const secret = process.env.JWT_SECRET || "secret";

// console.log('secret;', secret);

// let users=[];

const create_hash = async (password, saltRound) => {
  let hashed = await bcrypt.hash(password, saltRound);
  console.log(`${password} : ${hashed}`);
  return hashed;
};

router.post("/sign-up", async (req, res) => {
  const new_user = req.body;
  // new_user.id = users.length+1;
  console.log("new_user:", new_user);
  new_user.password = await create_hash(new_user.password, 10);
  // console.log('hased:',new_user.password);

  try {
    const result = await User.create(new_user);
    // console.log('result', result);
    res.send({ success: true, userid: result.userid });
  } catch (error) {
    res.send({ success: false, message: error, error: error });
  }

});

router.post("/sign-in", async (req, res) => {
  const user = req.body;
  console.log("user", user);
  const options = {
    attributes: ["password", "usertype"],
    where: {
      userid: user.userid,
    },
  };
  // const result = users.find((u)=> u.user_id === user.user_id);
  const result = await User.findOne(options);
  console.log("signin result:", result);
  if (result) {
    const compared = await bcrypt.compare(user.password, result.password);
    console.log(`${user.password}: ${result.password}:${compared}`);
    if (compared) {
      const token = jwt.sign({ uid: user.userid, rol: "admin" }, secret);
      console.log("token:", token);
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); //send token in the cookie
      res.send({ success: true, userid: user.userid, usertype: result.usertype, token: token }); //send token as a result
    } else {
      res.send({
        success: false,
        message: "사용자가 없거나 비번이 잘못되었습니다. ",
      });
    }
  } else {
    res.send({
      success: false,
      message: "사용자가 없거나 비번이 잘못되었습니다. ",
    });
  }
});

router.put("/:id", isAuth, async (req, res) => {
  const userid = req.params.id;
  const content = req.body;

  console.log("modified content:", content);
  try {
    const result = await User.update(content, { where: { userid: userid } });
    res.send({ succss: true });
  } catch (err) {
    res.send({ success: false, message: err, error: err });
  }
});

router.post("/buster", async (req, res) => {
  const new_buster = req.body;
  // const files = JSON.parse(req.body.profile);
  if (req.body.images) {
    new_buster.profile = req.body.images[0];
  
    console.log('buster:', new_buster);
  }
  
  try {
    const result = await Buster.create(new_buster);
    // console.log('result:', result);
    if (result) {
      const userupdate = await User.update(
        { usertype: "B" },
        { where: { userid: result.userid } }
      );
      console.log("userupdate:", userupdate);
    }
    // console.log('result', result);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

router.put("/buster/:id", isAuth,async (req, res) => {
  const userid = req.params.id;
  const content = req.body;
  console.log("userid", userid);
  // console.log('content:', post.content);
  console.log("modified content:", content);
  // post.content = content;
  try {
    const result = await Buster.update(content, { where: { userid: userid } });
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, message: err, error: err });
  }
  //해당 id가 글이 없는 경우, 처리 - 404?
});

router.get("/", isAuth, async (req, res) => {
  const userid = req.query.userid;
  console.log("userid:", userid);

  if (userid) {
    // const filtered = posts.filter ((post)=>post.user_id === user_id);
    const result = await User.findOne({
      // attributes: ['user_id', 'user_name'],
      where: { userid: userid },
    });
    res.send({ success: true, data: result });
  } else {
    // console.log('post length', posts.length);
    const result = await User.findAll({
      // attributes:['id', 'userid', 'content', 'updated_at'],
      order: [["created_at", "desc"]],
    });
    res.send({ success: true, data: result });
  }
});

router.get("/buster", isAuth, async (req, res) => {
  const userid = req.query.userid;
  console.log("userid:", userid);
  const options = {
    include: [
      {
        model: Buster,
        where: {
          userid: userid,
        },
        // attributes: ['id', 'userid', 'content', 'created_at']
      },
    ],
  };
  if (userid) {
    console.log('userid:', userid);
    // const filtered = posts.filter ((post)=>post.user_id === user_id);
    const result = await Buster.findOne({
        where: { userid: userid },
        attributes: [
          'id','userid','profile','selfintro','tech','exp','fav','accbank','accno',
          [sequelize.fn('COUNT', sequelize.col('Trades.id')), 'tradecount'] // Count the number of posts for each user
        ],
        include: [{
          model: Trade,
          attributes: [], // Fetch only the count without including Post attributes in the result
        }],
        group: ['Buster.userid']
    
    });
      
    if (result) {
      const reviewresult = await busterreviewviews.findOne({
        attributes:[ 'revcode1', 'revcode2', 'revcode3', 'revcode4', 'revcode5'],
        where: {busterid: userid}
      });
      result.dataValues.revcode1= reviewresult.revcode1;
      result.dataValues.revcode2= reviewresult.revcode2;
      result.dataValues.revcode3= reviewresult.revcode3;
      result.dataValues.revcode4= reviewresult.revcode4;
      result.dataValues.revcode5= reviewresult.revcode5;
      // console.log('reviewresult:', reviewresult);
      res.send({ success: true, data: result });
    } else
      res.send({ success: false, message: "해당 사용자의 정보가 없습니다." });
  } else {
    // console.log('post length', posts.length);
    const results = await Buster.findAll({
      attributes: [
        'id','userid','profile','selfintro','tech','exp','fav','accbank','accno',
        [sequelize.fn('COUNT', sequelize.col('Trades.id')), 'tradecount'] // Count the number of posts for each user
      ],
      include: [{
        model: Trade,
        attributes: [], // Fetch only the count without including Post attributes in the result
      }],
      group: ['Buster.userid'] ,
      order: [["created_at", "desc"]],
    })
    .then(async (results) => {  
      if (results && results.length > 0) {
        // Use map to add an additional field to each user in the result
        // const resultsWithAdditionalField = await Promise.all( results.map(async (result) => {
        //   console.log('resultid:', result.userid);
          
        //   await busterreviewviews.findOne({
        //     attributes:[ 'revcode1', 'revcode2', 'revcode3', 'revcode4', 'revcode5'],
        //     where: {busterid: result.userid}
        //   }).then (reviewresult => {
            
        //     const resultJson = result.toJSON();
        //     // resultJson.additionalField = 'someValue'; // Adding an additional field to each user
        //     resultJson.revcode1= reviewresult.revcode1;
        //     resultJson.revcode2= reviewresult.revcode2;
        //     resultJson.revcode3= reviewresult.revcode3;
        //     resultJson.revcode4= reviewresult.revcode4;
        //     resultJson.revcode5= reviewresult.revcode5;
        //     console.log('resultJson:', resultJson);
        //     return resultJson; 
        //   })
          
        // })).then (resultsWithAdditionalField => {
        // // console.log('result:',resultsWithAdditionalField);
        console.log('result:',results);
        res.send({ success: true, data: results });
      }
    }).catch((err) => {
      console.log('err:', err);
      res.send({ success: false, message: err, error: err });
    }
   );
    
}});

/////// SMS 코드 추가

// 메시지 전송, 랜덤 코드 받기
const { sendSMS, getAuthCode } = require("../sms/send_sms");
// 보낸 메시지 확인
const showSendList = require("../sms/send_list");

router.post("/sms", async (req, res) => {
  const phone = req.body.phone;
  console.log("phone:", phone);
  try {
    sendSMS(phone);
    showSendList();
    res.send({ success: true, phone: phone });
  } catch (error) {
    res.send({ success: false, message: error, error: error });
  }
});

router.post("/code", async (req, res) => {
  const phone = req.body.data.phone;
  const userCode = req.body.code; // 인증번호 6자리

  console.log("phone:", phone, "userCode:", userCode);
  try {
    const authCode = getAuthCode();
    if (userCode === authCode) {
      res.send({ success: true });
    } else {
      res.send({ success: false, message: "Invalid code" });
    }
  } catch (error) {
    res.send({ success: false, message: error, error: error });
  }
});

module.exports = router;
