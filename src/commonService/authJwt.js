const { json } = require("body-parser");

function auth(token) {
  try {
    const decode = json.parse(token);
    const expire = decode.expiresIn;
    const expired = new Date.now() >= expire * 100;
    return expired;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { auth };
