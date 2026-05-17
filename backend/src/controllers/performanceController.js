import Student from '../models/Student.js';
import { analyzeStudents } from '../utils/performance.js';

export async function analyzePerformance(req, res, next) {
  try {
    const students = await Student.find().select('-password -__v');
    const analysis = analyzeStudents(students, req.body);

    res.json({
      success: true,
      criteria: req.body,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
}
