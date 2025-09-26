import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Task from "../../lib/models/Task";
import { verifyToken } from "../../lib/auth";

async function getUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

export async function GET(req: Request) {
  await connectDB();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await Task.find({ userId: (user as any).id });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const task = await Task.create({ ...body, userId: (user as any).id });
  return NextResponse.json(task);
}
