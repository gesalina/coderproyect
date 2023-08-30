import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount : {
    type: Number
  },
  purchaser: {
    type: String,
    required: true
  },
});

mongoose.set("strictPopulate", false);

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);