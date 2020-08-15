const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const authController = require('./controllers/authController');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const cors = require('cors');
const User = require('./models/user');
const Comment = require('./models/comment');
const validator = require('./util/validators');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { stringify } = require('querystring');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/profileImage');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: uploadFilter });
require('dotenv').config();

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('DB connected!');
    }
  }
);

app.use('/public', express.static('public'));
app.use(
  require('cors')({
    origin: true,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

//Data sannitization against Nosql injection
app.use(mongoSanitize());

//Data sanitization against XXS (Client attack)
app.use(xss());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//ROUTES

//GET ALL CAMPGROUNDS
app.get('/api/v1/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find();
  res.status(200).json({
    status: 'success',
    results: campgrounds.length,
    data: {
      campgrounds,
    },
  });
});

//GET CAMPGROUND BY slug
app.get('/api/v1/campgrounds/:slug', async (req, res) => {
  const campground = await Campground.findOne({ slug: req.params.slug });

  res.status(200).json({
    status: 'success',
    data: {
      campground,
      user: req.user,
    },
  });
});

//Add campground
app.post('/api/v1/campgrounds', authController.protect, async (req, res) => {
  const data = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    author: {
      id: req.body.author.id,
      username: req.body.author.username,
    },
  };

  const { valid, errors } = validator.validateAddCampground(data);
  if (!valid) return res.status(400).json(errors);

  try {
    const campgrounds = await Campground.create({
      name: data.name,
      image: data.image,
      description: data.description,
      price: data.price,
      author: data.author,
    });
    res.status(200).json({
      status: 'success',
      campgrounds,
    });
  } catch (error) {
    res.json({
      status: 'fail',
      message: error,
      user: req.user,
    });
  }
});

//UPDATE CAMPGROUND
app.put('/api/v1/campgrounds/:id', authController.protect, async (req, res) => {
  const id = req.params.id;
  const data = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    author: {
      id: req.body.author.id,
      username: req.body.author.username,
    },
  };

  try {
    const authorId = await User.findById(data.author.id);
    if (authorId.name === data.author.username) {
      const campground = await Campground.findByIdAndUpdate(id, data);
      res.status(200).json({
        status: 'success',
        data: {
          campground,
        },
      });
    } else {
      return res.json({
        status: 'fail',
        message: 'Not the user!',
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: 'fail',
      message: err,
    });
  }
});

//delete
app.delete(
  '/api/v1/campgrounds/:slug',
  authController.protect,
  async (req, res) => {
    try {
      const campground = await Campground.findOneAndDelete({
        slug: req.params.slug,
      });
      res.status(200).json({
        status: 'success',
        message: 'Deleted',
      });
    } catch (err) {
      res.json({
        status: 'fail',
        message: err,
      });
    }
  }
);

//Add comment
app.post(
  '/api/v1/campgrounds/:id/comment',
  authController.protect,
  async (req, res) => {
    const userDetails = await User.findById(req.user._id);

    const comment = {
      text: req.body.text,
      postId: req.params.id,
      createdAt: new Date().toISOString(),
      author: {
        id: req.user._id,
        username: req.user.name,
        photo: userDetails.photo,
      },
    };

    if (req.body.text === '') {
      return res.status(400).json({
        errors: `Comment can't be empty`,
      });
    }

    try {
      const addComment = await Comment.create(comment);
      return res.json({
        status: 'success',
        data: addComment,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 'fail',
        message: error,
      });
    }
  }
);

//get comments by postid
app.get('/api/v1/comments/:id', authController.protect, async (req, res) => {
  try {
    const campground = await Campground.find({ _id: req.params.id });

    if (!campground) {
      return res.status(404).json({
        message: 'Campground not found!',
      });
    }

    if (campground) {
      const comments = await Comment.find({ postId: campground[0]._doc._id });

      res.json({
        comments,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//Update comment
app.put('/api/v1/comments/:id', authController.protect, async (req, res) => {
  const id = req.params.id;
  const newBody = req.body.text;

  try {
    const comment = await Comment.find({ _id: id });

    if (comment) {
      if (newBody !== '') {
        const theComment = await Comment.findOneAndUpdate(
          { _id: id },
          { text: newBody }
        );
        if (theComment) {
          return res.json({
            status: 'success',
            message: 'Comment updated sucessfully',
            theComment,
          });
        } else {
          return res.json({
            status: 'fail',
            message: 'Something went wrong',
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Comment not found!',
    });
  }
});

//Delete comment
app.delete('/api/v1/comments/:id', authController.protect, async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findByIdAndRemove(id);
    return res.json({
      status: 'success',
      message: 'Comment deleted',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
});

//User details
app.get('/api/v1/user', authController.protect, async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    if (userData) {
      return res.json({
        status: 'success',
        userData,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
});

//Update user details
app.put('/api/v1/user', authController.protect, async (req, res) => {
  const data = {
    name: req.body.name,
  };

  try {
    const updateData = await User.findByIdAndUpdate(req.user._id, {
      name: data.name,
    });

    if (updateData) {
      return res.json({
        status: 'success',
        updateData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
});

//Add image for user avatar
app.post(
  '/api/v1/user/image',
  authController.protect,
  upload.single('userImage'),
  (req, res) => {
    console.log(req.file);
  }
);

//Update image
app.put(
  '/api/v1/user/image',
  authController.protect,
  upload.single('userImage'),
  async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.user._id);
    try {
      console.log(req.file.path);
      const updatePhoto = await User.findByIdAndUpdate(req.user._id, {
        photo: req.file.path,
      });

      if (updatePhoto) {
        return res.json({
          status: 'success',
          message: 'Photo changed successully!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        error,
      });
    }
  }
);

app.put(
  '/api/v1/user/changePassword',
  authController.protect,
  async (req, res) => {
    const data = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmNewPassword: req.body.confirmNewPassword,
    };

    const { valid, errors } = validator.validateChangePassword(data);
    if (!valid) return res.status(400).json(errors);

    const checkOldPassword = await User.findOne({ _id: req.user._id }).select(
      '+password'
    );
    if (
      !checkOldPassword ||
      !(await checkOldPassword.correctPassword(
        data.oldPassword,
        checkOldPassword.password
      ))
    ) {
      return res.status(400).json({
        errors: 'Old password incorrect',
      });
    } else {
      const newPass = await bcrypt.hash(data.newPassword, 12);
      const updatePassword = await User.findByIdAndUpdate(req.user._id, {
        password: newPass,
      });
      return res.json({
        status: 'success',
        message: 'Password updated sucessfully',
      });
    }
  }
);

//AUTH
//Signup
app.post('/api/v1/signup', authController.signup);

//Login
app.post('/api/v1/login', authController.login);

// app.get('*', function (req, res) {
//   res.status(404).json({
//     status: 'fail',
//     message: 'Page not found!',
//   });
// });

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Application server has started and listening to port ${port}`);
});
