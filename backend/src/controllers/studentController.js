import Student from '../models/Student.js';

export async function addStudent(req, res, next) {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'A student with this email already exists.' });
      return;
    }

    next(error);
  }
}

export async function getStudents(_req, res, next) {
  try {
    const students = await Student.find().select('-password -__v').sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
}
