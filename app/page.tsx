"use client";
import { useState } from "react";

export default function Home() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUpload = async () => {
    if (!pdf) return alert("Upload a PDF first.");
    const formData = new FormData();
    formData.append("file", pdf);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error || "Upload failed");
    alert("PDF uploaded & processed");
  };

  const handleAsk = async () => {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error || "Error");
    setAnswer(json.answer);
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">PDF RAG Assistant</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload PDF
      </button>

      <div>
        <textarea
          rows={4}
          placeholder="Ask a question about the PDF"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2"
        />
        <button onClick={handleAsk} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
          Ask
        </button>
      </div>

      {answer && (
        <div className="p-4 border bg-gray-100 rounded">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
}
