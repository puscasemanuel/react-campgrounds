const User = require('./../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.cookie('jwt', token, cookieOptions);
  res.req.res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email and password exists
  if (!email || !password) {
    console.log('Please provide email and password!');
  } else {
    //check if user exist and the password exist
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return console.log('Inccorrect data!');
    }

    //if eery is ok send the token to the client
    const token = signToken(user._id);
    req.headers.authorization = token;
    if (token) {
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.cookie('session', 'Logged In!', {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    }

    const userData = await User.findOne({ email: email });

    res.status(200).json({
      status: 'success',
      userData,
    });
  }
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check if is there
  const token = req.cookies.jwt;
  const logSession = req.cookies.session;
  if (token && logSession) {
    //2) Verification token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err) {
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
          console.log('Not the user!');
        }
      }
    });
    next();
  } else {
    return res.json({
      status: 'fail',
      message: 'You have to login first!',
    });
  }
};
