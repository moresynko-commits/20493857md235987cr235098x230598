const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'your_discord_app_id';
const API_URL = '/api';

let accessToken = localStorage.getItem('discord_token');

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('userInfo');

  loginBtn.onclick = () => {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: window.location.origin + '/callback',
      response_type: 'token',
      scope: 'identify guilds'
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params}`;
  };

  logoutBtn.onclick = () => {
    localStorage.removeItem('discord_token');
    accessToken = null;
    updateUI();
  };

  if (accessToken) {
    fetchUser().then(updateUI);
  } else {
    updateUI();
  }

  // Forms
  document.getElementById('commForm').onsubmit = saveCommunity;
  document.getElementById('deptForm').onsubmit = addDept;
  document.getElementById('staffForm').onsubmit = addStaff;

  loadData();
});

async function fetchUser() {
  const res = await fetch(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.json();
}

async function updateUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('userInfo');

  if (user) {
    userInfo.textContent = `Hi ${user.username}!`;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline';
  } else {
    loginBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }
}

async function loadData() {
  // Fetch from /api/config
  // Populate lists
}

async function saveCommunity(e) {
  e.preventDefault();
  // POST /api/community
}

// Similar for dept, staff

