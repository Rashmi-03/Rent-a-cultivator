import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    machine: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default model('Booking', bookingSchema);



