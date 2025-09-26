"use client";
import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((prev) => prev + 1);

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
        const data = await res.json().catch(() => ({ error: "Invalid server response" }));
        if (res.ok) {
          alert("Signup successful! Please login.");
          setMode("login");
        } else alert(data.error || "Signup failed");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({ error: "Invalid server response" }));
        if (res.ok) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else alert(data.error || "Login failed");
      }
    } catch (err: unknown) {
  console.error("Auth error:", err);
  alert("Something went wrong. Check console.");
}

  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Task Manager App</h1>

      {!token ? (
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
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
            className="w-full bg-blue-600 py-2 rounded mb-3 text-white"
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
            className="bg-red-500 px-4 py-2 rounded mb-6 text-white"
          >
            Logout
          </button>

          {/* <TaskForm token={token} refresh={refresh} />
          <TaskList token={token} key={refreshKey} refreshKey={0} /> */}

          <TaskForm token={token} refresh={() => setRefreshKey(prev => prev + 1)} />
<TaskList token={token} refreshKey={refreshKey} />

        </div>
      )}
    </div>
  );
}

