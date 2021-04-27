const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  title: String,
  imgPath: String,
  imgName: String,
  publicId: String,
  genre: String,
  description: String,
  filePath: String,
  fileName: String,
  fileId: String,
  buffer: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;

