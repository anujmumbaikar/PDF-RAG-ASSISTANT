import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {OpenAI} from "openai";
import {OpenAIEmbeddings} from "@langchain/openai";
import fs from "fs";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import dotenv from "dotenv";
import { SearchCheck } from "lucide-react";

dotenv.config();
const embeddingModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
})
const openai = new OpenAI();


const PDFPath = "./assets/GENERATIVE-AI.pdf";
const loader = new PDFLoader(PDFPath);
const docs = await loader.load();

const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
})

const splitDocs = await text_splitter.splitDocuments(docs);
const vector_store = await QdrantVectorStore.fromDocuments(
    splitDocs,
    embeddingModel,
    {
        url: "http://localhost:6333",
        collectionName: "langchain"
    }
);
console.log("Vector store created with", splitDocs.length, "documents");


const vector_DB = await QdrantVectorStore.fromExistingCollection(
    embeddingModel,
    {
        url: "http://localhost:6333",
        collectionName: "langchain"
    }
);
