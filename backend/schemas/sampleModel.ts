import mongoose from "mongoose";
import Joi from "joi";

const sampleSchema = new mongoose.Schema({
  name: String,
});

export const Sample = mongoose.model("Sample", sampleSchema);

export const sampleValidation = Joi.object({
  name: Joi.string().required(),
});
