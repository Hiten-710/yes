import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Plus,
  Sparkles,
  Target,
  Trophy,
  UserRound
} from 'lucide-react';
import { addStudent, analyzePerformance, analyzePerformanceWithAi, getStudents } from './api';
import './styles.css';

const initialStudent = {
  name: '',
  email: '',
  subjects: 'Math, Science, English',
  subjectScores: 'Math:88, Science:91, English:76',
  attendance: 85,
  grade: 'A',
  previousGrades: 'B+, A-',
  projects: 'Science fair model',
  achievements: 'Math Olympiad qualifier',
  skills: 'Problem solving, Presentation'
};

const initialCriteria = {
  importantSubjects: 'Math, Science',
  minAttendance: 75,
  targetGrade: 'A'
};

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSubjectScores(value) {
  return value.split(',').reduce((scores, item) => {
    const [subject, score] = item.split(':').map((part) => part?.trim());
    const numericScore = Number(score);

    if (subject && Number.isFinite(numericScore)) {
      scores[subject] = numericScore;
    }

    return scores;
  }, {});
}

function App() {
  const [studentForm, setStudentForm] = useState(initialStudent);
  const [criteriaForm, setCriteriaForm] = useState(initialCriteria);
  const [students, setStudents] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const topStats = useMemo(() => {
    const high = analysis.filter((student) => student.rank === 'High').length;
    const averageScore = analysis.length
      ? Math.round(analysis.reduce((sum, student) => sum + student.performanceScore, 0) / analysis.length)
      : 0;

    return { high, averageScore };
  }, [analysis]);

  async function refreshStudents() {
    const response = await getStudents();
    setStudents(response.data);
  }

  useEffect(() => {
    refreshStudents().catch((error) => setMessage(error.message));
  }, []);

  function updateStudent(field, value) {
    setStudentForm((current) => ({ ...current, [field]: value }));
  }

  function updateCriteria(field, value) {
    setCriteriaForm((current) => ({ ...current, [field]: value }));
  }

  function getCriteriaPayload() {
    return {
      importantSubjects: splitList(criteriaForm.importantSubjects),
      minAttendance: Number(criteriaForm.minAttendance),
      targetGrade: criteriaForm.targetGrade
    };
  }

  async function submitStudent(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addStudent({
        name: studentForm.name,
        email: studentForm.email,
        subjects: splitList(studentForm.subjects),
        subjectScores: parseSubjectScores(studentForm.subjectScores),
        attendance: Number(studentForm.attendance),
        grade: studentForm.grade,
        previousGrades: splitList(studentForm.previousGrades),
        projects: splitList(studentForm.projects),
        achievements: splitList(studentForm.achievements),
        skills: splitList(studentForm.skills)
      });
      setStudentForm(initialStudent);
      await refreshStudents();
      setMessage('Student added successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function runBasicAnalysis() {
    setLoading(true);
    setMessage('');

    try {
      const response = await analyzePerformance(getCriteriaPayload());
      setAnalysis(response.data);
      setMessage('Performance analysis updated.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function runAiAnalysis() {
    setAiLoading(true);
    setMessage('');

    try {
      const response = await analyzePerformanceWithAi(getCriteriaPayload());
      setAnalysis(response.rankedStudents);
      setAiRecommendation(response.ai.recommendation);
      setMessage(response.ai.provider === 'fallback' ? 'AI needs an OpenRouter API key.' : 'AI recommendation generated.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> AI academic intelligence</span>
          <h1>Student Performance Prediction System</h1>
          <p>
            Rank students by attendance, subject alignment, grades, consistency, skills, projects, and AI-powered guidance.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={runBasicAnalysis} disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <BarChart3 size={18} />}
              Analyze
            </button>
            <button className="secondary-button" onClick={runAiAnalysis} disabled={aiLoading}>
              {aiLoading ? <Loader2 className="spin" size={18} /> : <Brain size={18} />}
              AI Suggestion
            </button>
          </div>
        </div>
        <div className="hero-panel" aria-label="Performance highlights">
          <div>
            <span>Class score</span>
            <strong>{topStats.averageScore}%</strong>
          </div>
          <div>
            <span>High performers</span>
            <strong>{topStats.high}</strong>
          </div>
          <div>
            <span>Total records</span>
            <strong>{students.length}</strong>
          </div>
        </div>
      </section>

      {message && <div className="toast">{message}</div>}

      <section className="workspace-grid">
        <form className="panel form-panel" onSubmit={submitStudent}>
          <div className="panel-heading">
            <UserRound />
            <div>
              <h2>Add Student</h2>
              <p>Academic profile and strengths</p>
            </div>
          </div>

          <label>
            Name
            <input value={studentForm.name} onChange={(event) => updateStudent('name', event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={studentForm.email} onChange={(event) => updateStudent('email', event.target.value)} required />
          </label>
          <label>
            Subjects
            <input value={studentForm.subjects} onChange={(event) => updateStudent('subjects', event.target.value)} />
          </label>
          <label>
            Subject Scores
            <input value={studentForm.subjectScores} onChange={(event) => updateStudent('subjectScores', event.target.value)} />
          </label>
          <div className="two-column">
            <label>
              Attendance %
              <input
                type="number"
                min="0"
                max="100"
                value={studentForm.attendance}
                onChange={(event) => updateStudent('attendance', event.target.value)}
                required
              />
            </label>
            <label>
              Grade
              <input value={studentForm.grade} onChange={(event) => updateStudent('grade', event.target.value)} required />
            </label>
          </div>
          <label>
            Previous Grades
            <input value={studentForm.previousGrades} onChange={(event) => updateStudent('previousGrades', event.target.value)} />
          </label>
          <label>
            Projects
            <input value={studentForm.projects} onChange={(event) => updateStudent('projects', event.target.value)} />
          </label>
          <label>
            Achievements
            <input value={studentForm.achievements} onChange={(event) => updateStudent('achievements', event.target.value)} />
          </label>
          <label>
            Skills
            <input value={studentForm.skills} onChange={(event) => updateStudent('skills', event.target.value)} />
          </label>
          <button className="primary-button full-button" disabled={loading}>
            <Plus size={18} />
            Add Student
          </button>
        </form>

        <section className="panel criteria-panel">
          <div className="panel-heading">
            <Target />
            <div>
              <h2>Performance Criteria</h2>
              <p>Teacher-defined expectations</p>
            </div>
          </div>
          <label>
            Important Subjects
            <input value={criteriaForm.importantSubjects} onChange={(event) => updateCriteria('importantSubjects', event.target.value)} />
          </label>
          <div className="two-column">
            <label>
              Minimum Attendance
              <input
                type="number"
                min="0"
                max="100"
                value={criteriaForm.minAttendance}
                onChange={(event) => updateCriteria('minAttendance', event.target.value)}
              />
            </label>
            <label>
              Target Grade
              <input value={criteriaForm.targetGrade} onChange={(event) => updateCriteria('targetGrade', event.target.value)} />
            </label>
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={runBasicAnalysis} disabled={loading}>
              <BarChart3 size={18} />
              Analyze
            </button>
            <button className="secondary-button" onClick={runAiAnalysis} disabled={aiLoading}>
              <Brain size={18} />
              AI
            </button>
          </div>

          <div className="student-list">
            <div className="list-title">
              <GraduationCap size={18} />
              Student Records
            </div>
            {students.length === 0 ? (
              <p className="muted">Add the first student to begin ranking.</p>
            ) : (
              students.map((student) => (
                <article className="student-chip" key={student._id}>
                  <div>
                    <strong>{student.name}</strong>
                    <span><Mail size={13} /> {student.email}</span>
                  </div>
                  <b>{student.grade}</b>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <section className="results-section">
        <div className="section-heading">
          <div>
            <h2>Performance Analysis</h2>
            <p>Ranked from strongest fit to highest support need</p>
          </div>
          <Award />
        </div>

        <div className="result-grid">
          {analysis.length === 0 ? (
            <div className="empty-state">
              <Trophy size={38} />
              <h3>No ranking yet</h3>
              <p>Run analysis after adding students to see performance scores and subject matches.</p>
            </div>
          ) : (
            analysis.map((student, index) => (
              <article className={`result-card ${student.rank.toLowerCase()}`} key={student._id ?? student.email}>
                <div className="rank-badge">#{index + 1}</div>
                <div className="result-topline">
                  <div>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                  </div>
                  <div className="score-ring" style={{ '--score': `${student.performanceScore}%` }}>
                    {student.performanceScore}%
                  </div>
                </div>
                <div className="metric-row">
                  <span>{student.rank} performance</span>
                  <span>{student.attendance}% attendance</span>
                  <span>{student.subjectScoreAverage}% avg</span>
                </div>
                <div className="subject-row">
                  {(student.matchedSubjects ?? []).map((subject) => (
                    <span className="subject-pill" key={subject}>
                      <CheckCircle2 size={13} />
                      {subject}
                    </span>
                  ))}
                  {(student.missingSubjects ?? []).map((subject) => (
                    <span className="subject-pill missing" key={subject}>
                      {subject}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {aiRecommendation && (
        <section className="ai-panel">
          <div className="panel-heading">
            <Brain />
            <div>
              <h2>AI Recommendation</h2>
              <p>OpenRouter analysis</p>
            </div>
          </div>
          <pre>{aiRecommendation}</pre>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
