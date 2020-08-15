const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const validator = require('../util/validators');

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
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  const { valid, errors } = validator.validateSignup(newUser);
  if (!valid) return res.status(400).json(errors);

  const emailCheck = await User.findOne({ email: newUser.email });

  if (emailCheck) {
    return res.status(400).json({
      errors: 'Email already taken',
    });
  }

  const addNewUser = await User.create({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    passwordConfirm: newUser.passwordConfirm,
    photo: 'public/profileImage/avatarPlaceholder.png',
  });

  const token = signToken(addNewUser._id);
  res.cookie('jwt', token, cookieOptions);
  res.req.res.status(201).json({
    status: 'success',
    token,
    data: {
      user: addNewUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email and password exists
  if (!email || !password) {
    return res.status(400).json({
      errors: 'Please provide email and password',
    });
  } else {
    //check if user exist and the password exist
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        errors: 'Email or password incorrect',
      });
    }

    //if ok send the token to the client
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
  let user;
  const token = req.cookies.jwt;
  const logSession = req.cookies.session;
  if (token && logSession) {
    let freshUser;
    //2) Verification token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err) {
        user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
        if (!freshUser) {
          console.log('Not the user!');
        }
      }
    });
  } else {
    return res.json({
      status: 'fail',
      message: 'You have to login first!',
    });
  }
};
