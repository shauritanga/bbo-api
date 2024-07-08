const jwt = require("jsonwebtoken");

const asyncHandler = require("./async.js");
const ErrorResponse = require("../utils/errorResponse.js");
const User = require("../models/user.js");

//protect routes
module.exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.satrtWith("Bearer")
  ) {
    token = req.headers.authorizaation.split(" ")[1];
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token;
  // }

  //make sure token exist
  if (!token) {
    return next(new ErrorResponse("Not authorized too access this route"));
  }
  //verify token
  try {
    const decoded = jwt.verify(token.process.env.JWT_SECTRET);
    console.log("🚀 ~ protect ~ decoded:", decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized too access this route"));
  }
});

module.exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
