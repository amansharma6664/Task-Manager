"use client";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
   refresh?: () => void;   // 👈 yeh add karo
}

interface Props {
  token: string;
  refreshKey?: number;
  onEdit?: (id: string, title: string, description: string) => void;
}

export default function TaskList({ token, refreshKey, onEdit }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
  try {
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      console.error("Unexpected response:", data);
      setTasks([]); // fallback to empty array
    }
  } catch (err) {
    console.error("Fetch tasks error:", err);
    setTasks([]);
  }
};

// TaskList.tsx (inside component)
const deleteTask = async (id: string) => {
  if (!confirm("Are you sure you want to delete this task?")) return;

  await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  refresh?.(); // refresh the list after deletion
};



  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <span className="text-xs italic">{task.status}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
            >
              Delete
            </button>
            {/* <button
              onClick={() => onEdit?.(task._id, task.title, task.description)}
              className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
            >
              Edit
            </button> */}
            <button
  onClick={() => onEdit?.(task._id, task.title, task.description)}
  className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
>
  Edit
</button>

          </div>
        </div>
      ))}
    </div>
  );
}
function refresh() {
  throw new Error("Function not implemented.");
}

