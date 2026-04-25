const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURL = 'mongodb://ranvitha:ranprof123@ac-0vxe24h-shard-00-00.gaqe4dd.mongodb.net:27017,ac-0vxe24h-shard-00-01.gaqe4dd.mongodb.net:27017,ac-0vxe24h-shard-00-02.gaqe4dd.mongodb.net:27017/?ssl=true&replicaSet=atlas-6ft0wu-shard-0&authSource=admin&appName=Cluster0';
const dbName = 'oursociety';

let db;

// Connect to MongoDB
MongoClient.connect(mongoURL)
  .then(client => {
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB!');
  })
  .catch(err => console.log('❌ MongoDB error:', err));

// ─────────────────────────────────────
// VOLUNTEER ROUTES
// ─────────────────────────────────────

// GET all volunteers
app.get('/api/volunteers', async (req, res) => {
  const volunteers = await db.collection('volunteers').find().toArray();
  res.json(volunteers);
});

// POST register new volunteer
app.post('/api/volunteers', async (req, res) => {
  const { name, skill, phone, area } = req.body;
  await db.collection('volunteers').insertOne({ 
    name, skill, phone, area,
    available: true 
  });
  res.json({ message: 'Volunteer registered!' });
});

// ─────────────────────────────────────
// REPORTS ROUTES
// ─────────────────────────────────────

// GET all reports
app.get('/api/reports', async (req, res) => {
  const reports = await db.collection('reports').find().toArray();
  res.json(reports);
});

// POST new report
app.post('/api/reports', async (req, res) => {
  const { title, desc, area } = req.body;
  await db.collection('reports').insertOne({
    title, desc, area,
    status: 'pending',
    assignedTo: null,
    date: new Date().toLocaleDateString()
  });
  res.json({ message: 'Report submitted!' });
});

// ─────────────────────────────────────
// ASSIGNMENT ROUTE
// ─────────────────────────────────────

// POST assign volunteer to problem
app.post('/api/assign', async (req, res) => {
  const { problemTitle, volunteerName } = req.body;

  // Update report with assigned volunteer
  await db.collection('reports').updateOne(
    { title: problemTitle },
    { $set: { assignedTo: volunteerName, status: 'assigned' } }
  );

  // Mark volunteer as busy
  await db.collection('volunteers').updateOne(
    { name: volunteerName },
    { $set: { available: false } }
  );

  res.json({ message: `${volunteerName} assigned!` });
});

// ─────────────────────────────────────
// COMPLETED ROUTE
// ─────────────────────────────────────

// POST mark problem as completed
app.post('/api/complete', async (req, res) => {
  const { problemTitle } = req.body;

  // Get the report to find who was assigned
  const report = await db.collection('reports').findOne({ title: problemTitle });

  // Mark report as completed
  await db.collection('reports').updateOne(
    { title: problemTitle },
    { $set: { status: 'completed' } }
  );

  // Make volunteer available again
  if (report && report.assignedTo) {
    await db.collection('volunteers').updateOne(
      { name: report.assignedTo },
      { $set: { available: true } }
    );
  }

  res.json({ message: 'Marked as completed!' });
});

// ─────────────────────────────────────
// START SERVER
// ─────────────────────────────────────
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});