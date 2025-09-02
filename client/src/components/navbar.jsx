import { useNavigate } from "react-router-dom";

export default function navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-6 bg-transparent">
      <h1 
        className="text-3xl font-bold tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        Notehub
      </h1>
      <div className="space-x-4">
        <button 
          onClick={() => navigate("/login")} 
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
        >
          Login
        </button>
        <button 
          onClick={() => navigate("/signup")} 
          className="px-5 py-2 border border-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg font-medium transition"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}
