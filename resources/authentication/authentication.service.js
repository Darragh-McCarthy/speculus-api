const fs = require("fs");
const jwt = require("jsonwebtoken");

function getKeyAsPromise(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject();
      }
      resolve(data);
    });
  });
}

const getPrivateKey = () => getKeyAsPromise(__dirname + "/private.pem");
const getPublicKey = () => getKeyAsPromise(__dirname + "/public.pem");

const issuer = "Speculus";
const subject = "some@user.com";
const audience = "http://speculus.app";

// 2 days   172800000
// 1d   86400000
// 10h   36000000
// 2.5 h   9000000
// 2h   7200000
// 1m   60000
// 5s   5000
// 1y   31557600000
// 100   100
// -3 da  -259200000
// -1h  -3600000
// -200  -200

const expiresIn = "7d";
const signOptions = {
  // issuer,
  // subject,
  // audience,
  expiresIn,
  algorithm: "RS256"
};
const verifyOptions = {
  // issuer,
  // subject,
  // audience,
  expiresIn,
  algorithms: ["RS256"]
};

const sign = payload =>
  getPrivateKey().then(key => {
    return jwt.sign(payload, key, signOptions);
  });

const verify = token =>
  getPublicKey().then(key => jwt.verify(token, key, verifyOptions));

const decode = token =>
  getPublicKey().then(key => jwt.decode(token, key, verifyOptions));

const isLoggedIn = async req => {
  const authCookie = req.cookies.SpeculusAccessToken;
  if (authCookie && typeof authCookie === "string") {
    try {
      await verify(authCookie);
      return true;
    } catch (e) {
      console.log(e);
    }
  }
  return false;
};

module.exports = {
  sign,
  verify,
  decode,
  isLoggedIn
};
