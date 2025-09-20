// src/api/chat.js
export async function sendChatMessage({ userId, message, artifactId }) {
  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ✅ JSON으로 보냄
    },
    body: JSON.stringify({
      userId,
      message,
      artifactId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat API 요청 실패 (status: ${res.status})`);
  }

  return res.json(); // { response: "...", audio_url: "..." }
}
