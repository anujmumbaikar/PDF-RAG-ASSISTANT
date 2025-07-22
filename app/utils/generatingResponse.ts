import { OpenAI } from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
dotenv.config();

export async function generatingResponse(question: string): Promise<string> {
  const embeddingModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  const openai = new OpenAI();
  const vector_DB = await QdrantVectorStore.fromExistingCollection(
    embeddingModel,
    {
      url: "http://localhost:6333",
      collectionName: "langchain",
    }
  );
  const search_results = await vector_DB.similaritySearch(question);
  const context = search_results.map((doc) => {
    return `PageContent:${doc.pageContent}\nMetadata:${
      doc.metadata.source
    }\nPdf:${JSON.stringify(
      doc.metadata.pdf,
      null,
      2
    )}\nLocation: ${JSON.stringify(doc.metadata.loc, null, 2)}\n`;
  });
  const SYSTEM_PROMPT = `
You are a helpful AI Assistant who answers user queries based on the available context
retrieved from a PDF file. Always include the page number and direct the user to the correct page.

Only use the provided context. Do not make up answers.
Context:
${context}
`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
  });
  if(!response.choices || response.choices.length === 0) {
    throw new Error("No response from OpenAI");
  }else{
   return response.choices[0].message.content ?? "No content returned from OpenAI.";
  }
}
