const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function getStudents() {
  return request('/api/students');
}

export function addStudent(student) {
  return request('/api/students', {
    method: 'POST',
    body: JSON.stringify(student)
  });
}

export function analyzePerformance(criteria) {
  return request('/api/performance', {
    method: 'POST',
    body: JSON.stringify(criteria)
  });
}

export function analyzePerformanceWithAi(criteria) {
  return request('/api/ai/performance', {
    method: 'POST',
    body: JSON.stringify(criteria)
  });
}
