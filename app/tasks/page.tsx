// "use client";
// import { useState } from "react";
// import TaskForm from "../components/TaskForm";
// import TaskList from "../components/TaskList";

// export default function TasksPage() {
//   const [refreshKey, setRefreshKey] = useState(0);

//   const refresh = () => setRefreshKey((prev) => prev + 1);
//   const token = localStorage.getItem("token"); // client-side token

//   if (!token) return <p>Please login to see tasks</p>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
//       <TaskForm token={token} refresh={refresh} />
//       <TaskList token={token} key={refreshKey} />
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  if (!token) return <p>Please login to see tasks</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm token={token} refresh={refresh} />
      <TaskList token={token} refreshKey={refreshKey} />
    </div>
  );
}
