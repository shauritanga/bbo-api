//@desc    Reguster user
//@route   POST /api/v1/auth/register

const errorResponse = require("../utils/errorResponse");

//@desc      Login user
//@route     POST /api/v1/auth/login
//@access    Public

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //validate email & password
  if (!email || password) {
    return next(errorResponse("Please provide an email and password", 400));
  }

  //ckeck for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
};

module.exports.sendTokenResponse = (user, statusCode, res) => {
  const token = getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 4 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
module.exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await user.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
