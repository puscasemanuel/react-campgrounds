const mongoose = require('mongoose');
const slugify = require('slugify');

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  price: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment',
  //   },
  // ],
});

campgroundSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

campgroundSchema.pre('findOneAndUpdate', function (next) {
  this._update.slug = slugify(this._update.name, { lower: true });
  next();
});

module.exports = mongoose.model('Campground', campgroundSchema);
