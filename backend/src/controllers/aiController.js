import Student from '../models/Student.js';
import { requestAiPerformanceAnalysis } from '../services/openRouter.js';
import { analyzeStudents } from '../utils/performance.js';

export async function analyzeWithAi(req, res, next) {
  try {
    const students = await Student.find().select('-password -__v');
    const criteria = req.body ?? {};
    const rankedStudents = analyzeStudents(students, criteria);
    const ai = await requestAiPerformanceAnalysis({ students: rankedStudents, criteria });

    res.json({
      success: true,
      criteria,
      rankedStudents,
      ai
    });
  } catch (error) {
    next(error);
  }
}
