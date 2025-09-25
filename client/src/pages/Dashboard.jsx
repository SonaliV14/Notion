import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Successfully logged in as {user.firstname} {user.lastname}
          </h1>
          <p className="text-lg text-neutral-400 mb-6">{user.email}</p>
          <button
            onClick={logout}
            className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-3xl font-bold">You are not logged in</h1>
      )}
    </div>
  );
};

export default Dashboard;
