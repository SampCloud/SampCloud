const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const savedTrackSchema = new Schema({
  title: String,
  imgPath: String,
  description: String,
  filePath: String,
  owner: String,
  likedId: String,
  savedId: String
});

const SavedTrack = mongoose.model('SavedTrack', savedTrackSchema);

module.exports = SavedTrack;

