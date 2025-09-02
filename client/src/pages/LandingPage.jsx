import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white">
      <Navbar />

      <main className="flex flex-col flex-grow justify-center items-center text-center px-6">
        <h2 className="text-5xl md:text-6xl font-bold mb-4">
          Your Smart Note Companion
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          Notehub helps you create, organize, and access your notes anytime, anywhere.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold shadow-lg transition"
        >
          Get Started
        </button>
      </main>

      <Footer />
    </div>
  );
}
