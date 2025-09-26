// "use client";
// import { useState } from "react";

// interface Props {
//   token: string;
//   refresh: () => void;
// }

// export default function TaskForm({ token, refresh }: Props) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title) return;

//     await fetch("/api/tasks", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ title, description }),
//     });

//     setTitle("");
//     setDescription("");
//     refresh();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 shadow-md space-y-3">
//       <input
//         type="text"
//         placeholder="Task Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-2 rounded border"
//         required
//       />
//       <textarea
//         placeholder="Task Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         className="w-full p-2 rounded border"
//       />
//       <button type="submit" className="bg-green-500 px-4 py-2 rounded text-white">
//         Add Task
//       </button>
//     </form>
//   );
// }


"use client";
import { useState } from "react";

interface Props {
  token: string;
  refresh: () => void;
}

export default function TaskForm({ token, refresh }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 shadow-md space-y-3">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded border"
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded border"
      />
      <button type="submit" className="bg-green-500 px-4 py-2 rounded text-white">
        Add Task
      </button>
    </form>
  );
}

