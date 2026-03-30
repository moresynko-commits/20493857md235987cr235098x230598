import React, { useState } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="glass p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="https://cdn.discordapp.com/attachments/1486940390081953944/1486940421828509757/MCRPX.png" alt="MCRPX" className="h-14 rounded-xl shadow-2xl" />
          <h1 className="text-4xl font-anton">MCRPX</h1>
        </div>
        <nav className="flex space-x-2">
          <button className="nav-tab active">Dashboard</button>
          <button className="nav-tab">Mod</button>
          <button className="nav-tab">ER:LC</button>
          <button className="nav-tab">Profiles</button>
          <button className="nav-tab">Apps</button>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">{darkMode ? '☀️' : '🌙'}</button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-2xl font-medium shadow-xl hover:shadow-2xl transition-all">
            Connect
          </button>
        </div>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-montserrat mb-4">Server Status</h2>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <span>247 Online</span>
            </div>
          </div>
          {/* More cards */}
        </div>
        
        {/* All 100+ features in tabs/content */}
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-3xl font-anton mb-6">ER:LC Lookup</h2>
          <div className="flex space-x-4">
            <input className="flex-1 p-4 rounded-2xl border border-slate-600 bg-slate-800" placeholder="Roblox ID or plate..." />
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-2xl font-montserrat font-semibold shadow-xl hover:shadow-glow">
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

