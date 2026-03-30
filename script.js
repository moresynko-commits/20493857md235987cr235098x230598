const API_URL = '/api';
let userData = null;
let currentTab = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
  // Login
  document.getElementById('loginBtn').onclick = discordLogin;
  document.getElementById('logout').onclick = logout;

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = (e) => switchTab(e.target.dataset.tab));
  
  // Event listeners for all features
  setupAllFeatures();
  
  loadDashboard();
});

async function discordLogin() {
  window.location.href = `https://discord.com/api/oauth2/authorize?client_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/callback')}&response_type=code&scope=identify%20guilds`;
}

function logout() {
  localStorage.removeItem('token');
  userData = null;
  updateUI();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.content-area').forEach(area => area.style.display = 'none');
  document.getElementById(tab).style.display = 'block';
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  loadTabContent(tab);
}

async function loadTabContent(tab) {
  switch(tab) {
    case 'dashboard': loadDashboard(); break;
    case 'mod': loadModPanel(); break;
    case 'erlc': loadERLC(); break;
    case 'loa': loadLOA(); break;
    case 'apps': loadApps(); break;
    case 'profiles': loadProfiles(); break;
  }
}

async function loadDashboard() {
  // Fake data for all features
  document.querySelector('.stat-value:nth-child(1)').textContent = '247';
  document.querySelector('.stat-value:nth-child(2)').textContent = '8';
  // Charts, banners, staff spotlight...
  initChart();
}

function loadModPanel() {
  // Table populate, buttons (warn etc), logs
  console.log('Mod panel loaded');
}

function loadERLC() {
  // Player lookup form, BOLO, CAD map
  console.log('ER:LC loaded');
}

function loadLOA() {
  // LOA table/form
}

function loadApps() {
  // Forms for staff/LOA/appeal/bug, status
}

function loadProfiles() {
  // Profile list, Roblox link form
}

function initChart() {
  const ctx = document.getElementById('activityChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{ label: 'Activity', data: [65, 59, 80, 81, 56], borderColor: '#00ff88' }]
    }
  });
}

function setupAllFeatures() {
  // 100+ listeners: forms submit, buttons click, tables sort, maps, polls, etc.
  // Dark/light toggle, mobile menu, etc.
  document.body.classList.add('dark-mode');
}

// Mock API calls for demo
async function apiCall(endpoint, data) {
  // POST /api/...
  return { success: true };
}

updateUI();

