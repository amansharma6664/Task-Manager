import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Task from "../../lib/models/Tasks";
import { verifyToken } from "../../lib/auth";

type UserPayload = { id: string; email: string } | null;

async function getUser(req: Request): Promise<UserPayload> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  return verifyToken(token) as UserPayload;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await Task.find({ userId: user.id });
    console.log("User from token:", user);

    return NextResponse.json(tasks);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("GET tasks error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const task = await Task.create({ ...body, userId: user.id });

    return NextResponse.json(task);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("POST task error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// app/api/tasks/route.ts
export async function DELETE(req: Request) {
  await connectDB();
  const user = (await getUser(req)) as { id: string } | null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const taskId = body.id;

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: user.id });
    if (!deletedTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted" });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
