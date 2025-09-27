"use client";
import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; description: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const refresh = () => setRefreshKey(prev => prev + 1);

  // Fetch tasks whenever token or refreshKey changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [token, refreshKey]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const handleAuth = async () => {
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("Signup successful! Please login.");
          setMode("login");
        } else {
          alert(data.error || "Signup failed");
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          alert(data.error || "Login failed");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      {!token ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl mb-4">{mode === "login" ? "Login" : "Signup"}</h2>

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-3 rounded border"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 rounded border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 rounded border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleAuth}
            className="w-full bg-blue-600 py-2 rounded mb-3 text-white hover:bg-blue-700"
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>

          <p className="text-sm text-center">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Signup here" : "Login here"}
            </span>
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded mb-6 text-white hover:bg-red-600"
          >
            Logout
          </button>

          <TaskForm
            token={token}
            refresh={refresh}
            editTaskId={editTaskId!}
            editData={editData!}
            cancelEdit={() => setEditTaskId(null)}
            updateTask={async (id, title, description) => {
              await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description }),
              });
              setEditTaskId(null);
              refresh();
            }}
          />

          <TaskList
            token={token}
            tasks={tasks}
            refresh={refresh}
            onEdit={(id, title, description) => {
              setEditTaskId(id);
              setEditData({ title, description });
            }}
          />
        </div>
      )}
    </div>
  );
}
