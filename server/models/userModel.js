import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  personsInHouse: {
    type: Number,
    required: true
  },
  houseSize: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'big']
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;