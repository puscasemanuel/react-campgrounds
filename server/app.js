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
app.get(
  '/api/v1/campgrounds/:slug',
  authController.protect,
  async (req, res) => {
    const campground = await Campground.findOne({ slug: req.params.slug });
    res.status(200).json({
      status: 'success',
      data: {
        campground,
      },
    });
  }
);

//Add campground
app.post('/api/v1/campgrounds', authController.protect, async (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const author = {
    id: req.body.author.id,
    username: req.body.author.username,
  };
  try {
    const campgrounds = await Campground.create({
      name: name,
      image: image,
      description: description,
      price: price,
      author: author,
    });
    res.status(200).json({
      status: 'success',
      campgrounds,
    });
  } catch (error) {
    res.json({
      status: 'fail',
      message: error,
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

//ONLY FOR PRODUCTION
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Application server has started and listening to port ${port}`);
});
