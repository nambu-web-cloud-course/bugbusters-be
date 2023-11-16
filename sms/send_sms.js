/**
 * 단문 문자(SMS) 발송 예제
 * 발신번호, 수신번호에 반드시 -, * 등 특수문자를 제거하여 기입하시기 바랍니다. 예) 01012345678
 */

const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

const apiKey = "NCSWWE0VPBRKGFVL";
const apiSecret = "XKTPWYZMM9PIY8VDRDDQCX0CCZSN0PFF";

const coolsms = require("coolsms-node-sdk").default;
const messageService = new coolsms(apiKey, apiSecret);

let authCode = "";

// 단일 발송
const sendSMS = async (phone) => {
  try {
    authCode = generateRandomCode();

    const phone_num = phone.replace(/-/g, "");
    const res = await messageService.sendOne({
      to: "01036761262",
      from: phone_num,
      text: `안녕하세요, 버그버스터즈입니다. 본인 확인을 위해 인증번호를 입력해주세요. (${authCode})`,
    });

    setTimeout(() => {
      authCode = "";
    }, 3 * 60 * 1000);

    return { authCode, expired: false };
  } catch (error) {
    throw error;
  }
};

module.exports = { sendSMS, getAuthCode: () => authCode };