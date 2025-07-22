# 📄 PDF RAG Assistant

A minimal PDF-based RAG (Retrieval-Augmented Generation) assistant. Users can upload a PDF, preview it, and ask questions about its contents using an AI agent.

## 🛠️ Tech Stack

- **Next.js** (App Router) – UI and backend routes  
- **LangChain** – Document splitting, vector search, and LLM orchestration  
- **Qdrant** – Vector database for semantic search  
- **OpenAI** – Embedding model + LLM (e.g., `gpt-4`, `gpt-3.5-turbo`)

---

## ✨ Features

- 📤 **PDF Upload**: Upload your own PDF documents  
- 🧠 **RAG-based QA**: Ask questions and get answers from your document  
- 👁️ **PDF Preview**: View the uploaded PDF side-by-side using an `<iframe>`  
- 🔎 **Chunking + Embedding**: Uses `RecursiveCharacterTextSplitter` + `text-embedding-3-small`  
- ⚡ **Fast Search**: Backed by Qdrant for quick vector retrieval

---

## 📦 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/pdf-rag-assistant.git
cd pdf-rag-assistant
```
### 2.Install Dependencies
```bash
npm install
```
### 3.Configure environment
```bash
OPENAI_API_KEY=your-openai-key
```
### 4.Start the server
```bash
docker compose up -d
npm run dev
```

## TODOS
1.Streaming for better UI experience.
2.User authentication
3.More Improved Prompting
4.User history

