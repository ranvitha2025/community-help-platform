const BASE_URL = 'http://localhost:3000';

// ─── VOLUNTEERS ───
async function getVolunteers() {
  const res = await fetch(`${BASE_URL}/api/volunteers`);
  return await res.json();
}

async function registerVolunteer(name, skill, phone, area) {
  const res = await fetch(`${BASE_URL}/api/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, skill, phone, area })
  });
  return await res.json();
}

// ─── REPORTS ───
async function getReports() {
  const res = await fetch(`${BASE_URL}/api/reports`);
  return await res.json();
}

async function submitReport(title, desc, area) {
  const res = await fetch(`${BASE_URL}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, desc, area })
  });
  return await res.json();
}

// ─── ASSIGNMENT ───
async function assignVolunteer(problemTitle, volunteerName) {
  const res = await fetch(`${BASE_URL}/api/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemTitle, volunteerName })
  });
  return await res.json();
}

// ─── PROGRESS ───
async function submitProgress(problem, text, image) {
  const res = await fetch(`${BASE_URL}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problem, text, image,
      date: new Date().toLocaleDateString()
    })
  });
  return await res.json();
}

async function getProgress() {
  const res = await fetch(`${BASE_URL}/api/progress`);
  return await res.json();
}

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Temporary in-memory database
let reports = [
  {
    title: "Garbage Issue",
    area: "Street 1",
    desc: "Garbage not cleaned",
    assignedTo: "Ravi",
    status: "pending",
    date: new Date().toLocaleString()
  },
  {
    title: "Water Leakage",
    area: "Street 2",
    desc: "Pipe broken",
    assignedTo: "Sita",
    status: "completed",
    date: new Date().toLocaleString()
  }
];

// ✅ GET all reports
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

// ✅ POST mark as completed
app.post('/api/complete', (req, res) => {
  const { problemTitle } = req.body;

  const report = reports.find(r => r.title === problemTitle);

  if (report) {
    report.status = 'completed';
    report.date = new Date().toLocaleString();
    res.json({ message: 'Marked as completed' });
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// ✅ (Optional) Add new report API
app.post('/api/add', (req, res) => {
  const { title, area, desc, assignedTo } = req.body;

  const newReport = {
    title,
    area,
    desc,
    assignedTo: assignedTo || null,
    status: "pending",
    date: new Date().toLocaleString()
  };

  reports.push(newReport);
  res.json({ message: 'Report added successfully' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});