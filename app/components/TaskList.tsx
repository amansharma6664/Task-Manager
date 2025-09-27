

// "use client";
// import { useEffect, useState } from "react";

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   status: string;
// }

// interface Props {
//   token: string;
//   refreshKey?: number;
//   onEdit?: (id: string, title: string, description: string) => void;
//   refresh?: () => void;   // 👈 yeh prop pass hoga parent se
// }

// export default function TaskList({ token, refreshKey, onEdit, refresh }: Props) {
//   const [tasks, setTasks] = useState<Task[]>([]);

//   const fetchTasks = async () => {
//     try {
//       const res = await fetch("/api/tasks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setTasks(data);
//       } else {
//         console.error("Unexpected response:", data);
//         setTasks([]); // fallback to empty array
//       }
//     } catch (err) {
//       console.error("Fetch tasks error:", err);
//       setTasks([]);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [refreshKey]); // 👈 refreshKey change hoga to list reload

//   const deleteTask = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this task?")) return;

//     await fetch(`/api/tasks/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     refresh?.(); // parent ka refresh call karo
//   };

//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => (
//         <div
//           key={task._id}
//           className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md"
//         >
//           <div>
//             <h3 className="font-bold">{task.title}</h3>
//             <p>{task.description}</p>
//             <span className="text-xs italic">{task.status}</span>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => deleteTask(task._id)}
//               className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
//             >
//               Delete
//             </button>
//             <button
//               onClick={() => onEdit?.(task._id, task.title, task.description)}
//               className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
//             >
//               Edit
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import TaskForm from "./TaskForm";

interface Task {
  _id: string;
  title: string;
  description: string;
}

interface Props {
  token: string;
  tasks: Task[];
  onEdit?: (id: string, title: string, description: string) => void;
  refresh: () => void;
  refreshKey?: number;
}

export default function TaskList({ token, tasks, refresh, refreshKey }: Props) {
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; description: string } | null>(null);

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    refresh();
  };

  const handleEdit = (task: Task) => {
    setEditTaskId(task._id);
    setEditData({ title: task.title, description: task.description });
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      {/* Task Form */}
      <TaskForm
        token={token}
        refresh={refresh}
        editTaskId={editTaskId || undefined}
        editData={editData || undefined}
        cancelEdit={cancelEdit}
      />

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-600">No tasks found. Add a new one!</p>
        )}
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md"
          >
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
