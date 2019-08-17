const authenticationService = require("./authentication.service");
var mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    try {
      await authenticationService.verify(token);
      const data = await authenticationService.decode(token);
      res.locals.userId = mongoose.Types.ObjectId(data.userId);

      res.locals.avatarUrl = data.avatarUrl;
      res.locals.fullName = data.fullName;
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({});
    }
  } else {
    res.status(401).json({});
  }
};

module.exports = {
  authMiddleware
};
