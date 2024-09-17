/**
 * WorkoutModel
 * @path server/models/workoutModel.js
 * @description Defines the Mongoose schema for workouts.
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WorkoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
