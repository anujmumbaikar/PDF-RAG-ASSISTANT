// app/api/ask/route.ts
import { z } from "zod";
import { NextResponse } from "next/server";
import { generatingResponse } from "@/app/utils/generatingResponse";

const bodySchema = z.object({
  question: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }
    const generateResponse = await generatingResponse(parsed.data.question);
    return NextResponse.json({ answer: generateResponse }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


