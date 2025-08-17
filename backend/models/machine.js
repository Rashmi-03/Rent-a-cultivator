import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const machineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { 
      type: String, 
      required: true,
      // Base64 images can be very long, so we need to handle large strings
      maxlength: 10000000 // ~10MB base64 string limit
    },
    hourlyRate: { type: Number, required: true, min: 0 },
    dailyRate: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    features: [{ type: String, trim: true }],
    stock: { type: Number, default: 1, min: 0 }
  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { name: 1 },
      { category: 1 },
      { available: 1 },
      { location: 1 }
    ]
  }
);

export default model('Machine', machineSchema);



