"use client";
import { useEffect, useState } from "react";

interface Props {
  token: string;
  refreshKey: number; // refresh list when key changes
}

export default function TaskList({ token, refreshKey }: Props) {
  interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  userId: string;
}

const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);

 const fetchTasks = async () => {
  try {
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (Array.isArray(data)) {
      setTasks(data);
    } else if (data.task) {
      setTasks([data.task]); // POST ke response ke liye
    } else {
      setTasks([]);
    }

    setLoading(false);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    setTasks([]);
    setLoading(false);
  }
};

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, refreshKey]);

//   const deleteTask = async (id: string) => {
//     await fetch("/api/tasks", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ id }),
//     });
//     fetchTasks();
//   };

const deleteTask = async (id: string) => {
  try {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.ok) {
      fetchTasks(); // refresh task list
    } else {
      alert(data.error || "Delete failed");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Something went wrong while deleting");
  }
};


  // 👇 Ye line yaha add karo
  if (!token) return <p>Please log in to see your tasks.</p>;

  if (loading) return <p>Loading...</p>;
  if (tasks.length === 0) return <p>No tasks added yet.</p>;

  return (
    // <div className="space-y-4">
    //   {tasks.map((task) => (
    //     <div
    //       key={task._id}
    //       className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md"
    //     >
    //       <div>
    //         <h3 className="font-bold">{task.title}</h3>
    //         <p>{task.description}</p>
    //         <span className="text-xs italic">{task.status}</span>
    //       </div>
    //       <button
    //         onClick={() => deleteTask(task._id)}
    //         className="bg-red-600 px-3 py-1 rounded text-white"
    //       >
    //         Delete
    //       </button>
    //     </div>
    //   ))}
    // </div>
     <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md"
        >
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <span className="text-xs italic">{task.status}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-600 px-3 py-1 rounded text-white"
            >
              Delete
            </button>
            <button
              onClick={() => alert("Edit feature coming soon")}
              className="bg-yellow-500 px-3 py-1 rounded text-white"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
