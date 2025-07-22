"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Home() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!pdf) return setError("Upload a PDF first.");
    setUploading(true);
    setError(null);
    setUploaded(false);
    setAnswer("");
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setUploaded(true);
      setPdfUrl(URL.createObjectURL(pdf));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    setAsking(true);
    setError(null);
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setAnswer(json.answer);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAsking(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploaded(false);
    setAnswer("");
    const file = e.target.files?.[0] || null;
    setPdf(file);
    setPdfUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 flex flex-col">
      <header className="w-full border-b border-gray-800 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-6 h-6 text-gray-400" />
          PDF RAG Assistant
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.reload()}
          className="rounded-full hover:bg-gray-800"
          aria-label="Reset"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.003 7.003 0 0112 5c3.314 0 6.127 2.388 6.918 5.5M18.418 15A7.003 7.003 0 0112 19c-3.314 0-6.127-2.388-6.918-5.5" /></svg>
        </Button>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-12 max-w-6xl w-full mx-auto">
        {/* Left: Upload & Ask */}
        <section className="flex-1 flex flex-col gap-8 max-w-xl mx-auto md:mx-0">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col gap-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload PDF</label>
            <div className="flex items-center gap-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="bg-gray-900 border-gray-700 text-gray-100 file:bg-gray-700 file:text-gray-200 file:border-0 file:rounded file:px-3 file:py-1.5 file:mr-4 file:cursor-pointer"
                disabled={uploading}
              />
              <Button
                onClick={handleUpload}
                disabled={!pdf || uploading}
                className="gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                variant="default"
                size="sm"
              >
                {uploading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {pdf && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <FileText className="w-4 h-4" />
                {pdf.name}
              </div>
            )}
            {uploaded && (
              <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" />
                PDF uploaded successfully!
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col gap-4 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">Ask a question</label>
            <Textarea
              rows={4}
              placeholder="Ask a question about the PDF"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-100 focus:ring-2 focus:ring-gray-600"
              disabled={!uploaded || asking}
            />
            <Button
              onClick={handleAsk}
              disabled={!question.trim() || !uploaded || asking}
              className="gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
              variant="default"
              size="sm"
            >
              {asking ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
              {asking ? "Asking..." : "Ask"}
            </Button>
            {answer && (
              <div className="p-4 border border-gray-700 bg-gray-900 rounded mt-2 text-gray-100 animate-fade-in">
                <strong className="text-gray-300">Answer:</strong> {answer}
              </div>
            )}
          </div>
        </section>
        {/* Right: PDF Preview */}
        <aside className="flex-1 min-w-[320px] max-w-2xl flex flex-col items-center">
          <div className="w-full h-[600px] bg-gray-900 border border-gray-700 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            {pdfUrl && uploaded ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-full rounded-xl border-0 bg-gray-900"
                aria-label="PDF Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                <FileText className="w-10 h-10" />
                <span className="text-sm">PDF preview will appear here after upload</span>
              </div>
            )}
          </div>
        </aside>
      </main>
      <footer className="w-full border-t border-gray-800 py-4 px-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} PDF RAG Assistant. All rights reserved.
      </footer>
    </div>
  );
}
