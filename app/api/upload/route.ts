import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

// Allow large file uploads
export const maxSize = 20 * 1024 * 1024; // 20MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to disk
    const filename = `${uuidv4()}.pdf`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.writeFile(uploadPath, buffer);

    // Load and process with LangChain
    const loader = new PDFLoader(uploadPath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    await QdrantVectorStore.fromDocuments(
      chunks,
      new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
      {
        url: "http://localhost:6333",
        collectionName: "langchain",
      }
    );

    return NextResponse.json({ message: "PDF uploaded & embedded successfully" });
  } catch (err) {
    console.error("UPLOAD ERROR", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
