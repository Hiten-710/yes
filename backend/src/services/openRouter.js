export async function requestAiPerformanceAnalysis({ students, criteria }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key') {
    return {
      provider: 'fallback',
      recommendation:
        'OpenRouter API key is not configured. Add OPENROUTER_API_KEY to backend/.env or Render to enable AI recommendations.'
    };
  }

  const prompt = `
You are an academic performance analyst. Rank students, explain the strongest and weakest cases, and give concise personalized improvement suggestions.

School criteria:
- Important subjects: ${(criteria.importantSubjects ?? []).join(', ') || 'Not specified'}
- Minimum attendance: ${criteria.minAttendance ?? 75}%
- Target grade: ${criteria.targetGrade ?? 'A'}

Students:
${students
  .map(
    (student, index) => `${index + 1}. ${student.name} - subjects: ${(student.subjects ?? []).join(', ') || 'none'} - attendance: ${
      student.attendance
    }% - grade: ${student.grade} - skills: ${(student.skills ?? []).join(', ') || 'none'} - projects: ${
      (student.projects ?? []).join(', ') || 'none'
    } - achievements: ${(student.achievements ?? []).join(', ') || 'none'}`
  )
  .join('\n')}

Return a compact JSON object with keys: summary, topStudents, riskStudents, recommendations.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.FRONTEND_URL ?? 'http://localhost:5173',
      'X-Title': 'Student Performance Prediction System'
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-5.2',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    provider: 'openrouter',
    recommendation: data.choices?.[0]?.message?.content ?? 'No AI recommendation returned.'
  };
}
