import { Sample } from "../schemas/sampleModel";

export async function getAllSamples() {
  return Sample.find();
}
