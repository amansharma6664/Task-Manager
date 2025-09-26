// "use client";
// import { useEffect, useState } from "react";

// interface Props {
//   token: string;
// }

// export default function TaskList({ token }: Props) {
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     try {
//       const res = await fetch("/api/tasks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setTasks(data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [token]);

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

//   if (loading) return <p>Loading...</p>;

//   if (tasks.length === 0) return <p>No tasks added yet.</p>;

//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => (
//         <div key={task._id} className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md">
//           <div>
//             <h3 className="font-bold">{task.title}</h3>
//             <p>{task.description}</p>
//             <span className="text-xs italic">{task.status}</span>
//           </div>
//           <button
//             onClick={() => deleteTask(task._id)}
//             className="bg-red-600 px-3 py-1 rounded text-white"
//           >
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";

interface Props {
  token: string;
  refreshKey: number; // refresh list when key changes
}

export default function TaskList({ token, refreshKey }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, refreshKey]);

  const deleteTask = async (id: string) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  if (loading) return <p>Loading...</p>;
  if (tasks.length === 0) return <p>No tasks added yet.</p>;

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-200 p-4 rounded flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <span className="text-xs italic">{task.status}</span>
          </div>
          <button
            onClick={() => deleteTask(task._id)}
            className="bg-red-600 px-3 py-1 rounded text-white"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
