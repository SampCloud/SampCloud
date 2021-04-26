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
  role: {
    type: String,
    enum: ['singer', 'producer']
  },
  tracks: [{
    type: Schema.Types.ObjectId,
    ref: 'Track'
  }],
});

const User = model("User", userSchema);

module.exports = User;
