"use client";
import { useState, useEffect } from "react";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";

export default function TasksPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  if (!token) return <p>Please login to see tasks</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm token={token} refresh={() => {}} />
      <TaskList token={token} tasks={[]} refresh={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
}
