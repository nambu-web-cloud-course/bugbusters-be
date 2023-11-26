// API Signature 생성 + 메시지 목록 불러오기 예제
// 회원가입 -> 개발 / 연동 -> API key 관리
// console.coolsms.co.kr/credentials
// 회원가입시 무료 50건 발송 가능
const crypto = require("crypto");
const axios = require("axios");

const now = new Date().toISOString();
// 16진수 64자의 랜덤 값 생성
const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
const salt = genRanHex(64);
const message = now + salt;
const apiKey = process.env.SMS_APIKEY;
const apiSecret = process.env.SMS_APISECRET;
const signature = crypto
  .createHmac("sha256", apiSecret)
  .update(message)
  .digest("hex");

// 생성한 시그니처를 사용하여 API 호출

const showSendList = () => {
  const uri = `https://api.coolsms.co.kr/messages/v4/list?limit=1`;
  axios
    .get(uri, {
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

module.exports = showSendList;

// 전송시 결과값
// {
//   groupId: 'G4V20231115233152JAQ9S5HAYHJ5D7U',
//   to: '01036761262',
//   from: '01036761262',
//   type: 'SMS',
//   statusMessage: '정상 접수(이통사로 접수 예정) ',
//   country: '82',
//   messageId: 'M4V20231115233152KTG3OMJVOR82QWS',
//   statusCode: '2000',
//   accountId: '23111531643871'
// }
