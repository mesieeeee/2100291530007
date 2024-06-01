import mongoose from "mongoose";

const NumberSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    }
});

export const NumberModel = mongoose.model("Number", NumberSchema);

