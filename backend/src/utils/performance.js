const gradeValues = {
  'A+': 98,
  A: 92,
  'A-': 88,
  'B+': 84,
  B: 78,
  'B-': 74,
  'C+': 68,
  C: 62,
  'C-': 58,
  D: 48,
  F: 35
};

function normalizeGrade(grade = '') {
  return String(grade).trim().toUpperCase();
}

export function gradeToScore(grade) {
  return gradeValues[normalizeGrade(grade)] ?? 65;
}

function getSubjectScores(student) {
  const raw = student.subjectScores;

  if (!raw) return [];

  if (raw instanceof Map) {
    return [...raw.values()].map(Number).filter(Number.isFinite);
  }

  return Object.values(raw).map(Number).filter(Number.isFinite);
}

function average(values, fallback = 0) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function analyzeStudents(students, criteria = {}) {
  const importantSubjects = criteria.importantSubjects ?? [];
  const minAttendance = Number(criteria.minAttendance ?? 75);
  const targetGradeScore = gradeToScore(criteria.targetGrade ?? 'A');

  return students
    .map((studentDoc) => {
      const student = studentDoc.toObject ? studentDoc.toObject() : studentDoc;
      const subjects = student.subjects ?? [];
      const matchedSubjects = importantSubjects.filter((subject) => subjects.includes(subject));
      const subjectMatchRatio = importantSubjects.length ? matchedSubjects.length / importantSubjects.length : 1;
      const scoreAverage = average(getSubjectScores(student), gradeToScore(student.grade));
      const attendanceRatio = Math.min(Number(student.attendance ?? 0) / Math.max(minAttendance, 1), 1);
      const gradeRatio = Math.min(gradeToScore(student.grade) / Math.max(targetGradeScore, 1), 1);
      const consistency = average(
        [student.grade, ...(student.previousGrades ?? [])].map(gradeToScore),
        gradeToScore(student.grade)
      );
      const consistencyRatio = Math.min(consistency / Math.max(targetGradeScore, 1), 1);

      const performanceScore = Math.round(
        (subjectMatchRatio * 0.35 + attendanceRatio * 0.25 + gradeRatio * 0.2 + scoreAverage / 100 * 0.1 + consistencyRatio * 0.1) *
          100
      );

      const rank =
        performanceScore >= 80 && Number(student.attendance) >= minAttendance
          ? 'High'
          : performanceScore >= 55
            ? 'Average'
            : 'Low';

      return {
        ...student,
        matchedSubjects,
        missingSubjects: importantSubjects.filter((subject) => !subjects.includes(subject)),
        subjectScoreAverage: Math.round(scoreAverage),
        attendanceMeetsCriteria: Number(student.attendance) >= minAttendance,
        performanceScore,
        rank
      };
    })
    .sort((a, b) => b.performanceScore - a.performanceScore);
}
