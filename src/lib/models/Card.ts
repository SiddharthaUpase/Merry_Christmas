import mongoose from 'mongoose';

const VictimSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: true
  },
  roast: {
    type: String,
    required: true
  },
  cardId: {
    type: Number,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Victims'
});

export const Victim = mongoose.models.Victim || mongoose.model('Victim', VictimSchema);