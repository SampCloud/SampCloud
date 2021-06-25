const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  imgPath: String,
  imgName: String,
  publicId: String,
  artisticName: String,
  soundUrl: String,
  description: String,
  bgImg: String,
  bgImgName: String,
  bgPublicId: String,
  role: {
    type: String,
    enum: ['singer', 'producer']
  },
  savedSamples: [{
    type: Schema.Types.ObjectId,
    ref: 'SavedTrack'
  }],
  likedSamples: [{
    type: Schema.Types.ObjectId,
    ref: 'SavedTrack'
  }],
});

const User = model("User", userSchema);

module.exports = User;
