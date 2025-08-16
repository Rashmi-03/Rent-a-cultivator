import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const machineSchema = new Schema(
  {
    name: { type: String },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default model('Machine', machineSchema);



