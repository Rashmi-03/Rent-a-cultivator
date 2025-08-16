import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    machine: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    // Additional fields for enhanced booking functionality
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    durationType: { type: String, enum: ['hours', 'days'], default: 'hours' },
    distance: { type: Number, default: 0 },
    basePrice: { type: Number, required: true },
    distancePrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    specialRequirements: { type: String, default: '' },
    // Equipment details for easier access
    equipmentId: { type: String, required: true },
    equipmentName: { type: String, required: true }
  },
  { timestamps: true }
);

export default model('Booking', bookingSchema);



