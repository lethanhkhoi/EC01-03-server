const ObjectID = require("mongodb").ObjectId;
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const createHmacString = (message, key) => {
  const keyByte = CryptoJS.enc.Utf8.parse(key);
  const messageByte = CryptoJS.enc.Utf8.parse(message);
  const signature = CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA256(messageByte, keyByte)
  );
  return signature;
};
createLink = async (
  order,
  amount,
  userInfo,
  redirectHost,
  ipnHost,
  extraData = ""
) => {
  const partnerCode = "MOMOAW9G20220621";
  const accessKey = "CLklE8r9yEAu5TqG";
  const secretKey = "KItonNacd1IPZ3vJKc1IlFeyCmpwRsJL";

  const redirectUrl = `${redirectHost}`;
  const ipnUrl = `https://ec01-03-server.herokuapp.com/checkout/notifyMomo`;
  // const ipnUrl = `http://localhost:3001/checkout/notifyMomo`;

  const orderId = order;
  const orderInfo = `Pay for order ID ${orderId} with Momo`;
  const requestId = partnerCode + new Date().getTime();

  const requestType = "captureWallet";

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join("&");

  const signature = createHmacString(rawSignature, secretKey);
  const requestBody = {
    accessKey: accessKey,
    amount: amount,
    extraData: extraData,
    ipnUrl: ipnUrl,
    orderId: orderId,
    orderInfo: orderInfo,
    partnerCode: partnerCode,
    redirectUrl: redirectUrl,
    requestId: requestId,
    requestType: requestType,
    userInfo: userInfo,
    signature: signature,
  };
  try {
    const response = await axios.post(
      "https://test-payment.momo.vn:443/v2/gateway/api/create",
      requestBody
    );
    const { payUrl } = response.data;
    return [orderId, payUrl];
  } catch (error) {
    console.log("error", error);
    return null
  }
};
module.exports = {
  createLink,
};
