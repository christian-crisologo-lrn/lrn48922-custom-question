const SERVER_BASE_URL = 'http://localhost:3001';

export async function signLearnosityRequest(assessment) {
  const clone = JSON.parse(JSON.stringify(assessment));
  const payload = Object.assign(clone, { session_id: crypto.randomUUID() });

  const response = await fetch(`${SERVER_BASE_URL}/sign-learnosity-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
}
