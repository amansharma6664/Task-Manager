"use client";
import { useState, useEffect } from "react";

interface Props {
  token: string;
  refresh: () => void;
  editTaskId?: string;
  editData?: { title: string; description: string };
  cancelEdit?: () => void;
  updateTask?: (id: string, title: string, description: string) => Promise<void>; // <- async ka return type
}


export default function TaskForm({ token, refresh, editTaskId, editData, cancelEdit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Prefill form when editData changes
//   useEffect(() => {
//     if (editData) {
//       setTitle(editData.title || "");
//       setDescription(editData.description || "");
//     }
//   }, [editData]);
useEffect(() => {
  if (editTaskId && editData) {
    setTitle(editData.title);
    setDescription(editData.description);
  } else if (!editTaskId) {
    setTitle("");
    setDescription("");
  }
}, [editTaskId, editData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const url = editTaskId ? `/api/tasks/${editTaskId}` : "/api/tasks";
    const method = editTaskId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    refresh();

    // cancel edit mode after update
    if (cancelEdit) cancelEdit();
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
      <div className="flex space-x-2">
        {/* <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${editTaskId ? "bg-blue-500" : "bg-green-500"}`}
        >
          {editTaskId ? "Update Task" : "Add Task"}
        </button>
        {editTaskId && cancelEdit && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-500 px-4 py-2 rounded text-white"
          >
            Cancel
          </button> */}
          <button
  type="submit"
  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition-colors duration-200"
>
  {editTaskId ? "Update Task" : "Add Task"}
</button>

{editTaskId && (
  <button
    type="button"
    onClick={cancelEdit}
    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white transition-colors duration-200"
  >
    Cancel
  </button>
)}

      </div>
    </form>
  );
}
