const { verify, decode } = require("./authentication.service");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.SpeculusAccessToken;
  if (token && typeof token === "string") {
    try {
      await verify(token);
      const decoded = await decode(token);

      res.locals.user = {
        id: mongoose.Types.ObjectId(decoded.userClientSideObject._id),
        avatarUrl: decoded.userClientSideObject.avatarUrl,
        name: decoded.userClientSideObject.facebook.name
      };
      next();
    } catch (e) {
      console.log("error", e);
      res.status(401).json({});
    }
  } else {
    console.log("no auth header");
    res.status(401).json({});
  }
};

module.exports = {
  authMiddleware
};
