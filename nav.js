const translations = {
  en: {
    siteTitle: "Our Society",
    navDashboard: "Dashboard", navReport: "Report",
  
    navCompleted: "Completed", navHelp: "Help"
  },
  kn: {
    siteTitle: "ನಮ್ಮ ಸಮಾಜ",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", navReport: "ವರದಿ",
    navCompleted: "ಪೂರ್ಣಗೊಂಡಿದೆ", navHelp: "ಸಹಾಯ"
  },
  hi: {
    siteTitle: "हमारा समाज",
    navDashboard: "डैशबोर्ड", navReport: "रिपोर्ट",
    navCompleted: "पूर्ण", navHelp: "सहायता"
  }
};

function injectNav() {
  // Creates the header+nav on EVERY page automatically
  const header = document.createElement('div');
  header.innerHTML = `
    <header style="background:#003580; color:white; padding:15px; position: relative;">
    <div style="text-align: corner;">
      <h1 id="site-title">Our Society</h1>
      </div>
      <div style="position:absolute; top:15px; right:15px;">
      <select id="lang-picker" onchange="changeLanguage(this.value)"
        style=" padding:4px 10px; border-radius:5px; border:none;">
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="hi">हिंदी</option>
      </select>
      </div>
    </header>
    <nav style="background:#00204a; display:flex; justify-content:center; gap:20px; padding:10px; flex-wrap:wrap;">
      <a id="nav-dashboard" href="Dashboard.html" style="color:white; text-decoration:none;">Dashboard</a>
      <a id="nav-report" href="report.html" style="color:white; text-decoration:none;">Report</a>
      <a id="nav-volunteers" href="volunteers.html" style="color:white; text-decoration:none;">Volunteers</a>
      <a id="nav-completed" href="Completed.html" style="color:white; text-decoration:none;">Completed</a>
      <a id="nav-help" href="help.html" style="color:white; text-decoration:none;">Help</a>
      <a id="nav-assignment" href="assignment.html" style="color:white; text-decoration:none;">Assignment</a>

    </nav>
  `;
  document.body.insertBefore(header, document.body.firstChild);
  applyLanguage(localStorage.getItem('lang') || 'en');
}

function changeLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('site-title', t.siteTitle);
  set('nav-dashboard', t.navDashboard);
  set('nav-report', t.navReport);
  set('nav-volunteers', t.navVolunteers);
  set('nav-completed', t.navCompleted);
  set('nav-help', t.navHelp);
  const picker = document.getElementById('lang-picker');
  if (picker) picker.value = lang;
}

// Auto-run when page loads
document.addEventListener('DOMContentLoaded', injectNav);