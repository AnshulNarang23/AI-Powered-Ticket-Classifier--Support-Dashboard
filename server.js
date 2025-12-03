const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'tickets.json');

function loadTickets() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTickets(tickets) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2), 'utf8');
}

function classifyTicket(description) {
  const text = description.toLowerCase();

  let category = 'General';
  if (text.includes('bug') || text.includes('error') || text.includes('issue') || text.includes('crash')) {
    category = 'Bug Report';
  } else if (text.includes('feature') || text.includes('enhancement') || text.includes('improvement')) {
    category = 'Feature Request';
  } else if (text.includes('bill') || text.includes('payment') || text.includes('invoice') || text.includes('refund')) {
    category = 'Billing Issue';
  } else if (text.includes('how to') || text.includes('help') || text.includes('cannot') || text.includes("can't")) {
    category = 'Technical Query';
  }

  let priority = 'Medium';
  if (text.includes('urgent') || text.includes('asap') || text.includes('immediately') || text.includes('production down') || text.includes('critical')) {
    priority = 'High';
  } else if (text.includes('whenever') || text.includes('low priority') || text.includes('nice to have')) {
    priority = 'Low';
  }

  return { category, priority };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication - in production, use proper password hashing and database
  const validUsers = {
    admin: 'admin123',
    user: 'user123'
  };

  if (validUsers[username] && validUsers[username] === password) {
    const token = Buffer.from(username + ':' + Date.now()).toString('base64');
    res.json({ 
      success: true, 
      token,
      role: username === 'admin' ? 'admin' : 'user'
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

app.get('/api/tickets', (req, res) => {
  const { category, priority, search } = req.query;
  let tickets = loadTickets();

  if (category) {
    tickets = tickets.filter(t => t.category === category);
  }
  if (priority) {
    tickets = tickets.filter(t => t.priority === priority);
  }
  if (search) {
    const s = search.toLowerCase();
    tickets = tickets.filter(
      t =>
        t.name.toLowerCase().includes(s) ||
        t.email.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s)
    );
  }

  res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
  const { name, email, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: 'Name, email and description are required.' });
  }

  const { category, priority } = classifyTicket(description);
  const tickets = loadTickets();

  const newTicket = {
    id: Date.now().toString(),
    name,
    email,
    description,
    category,
    priority,
    createdAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  saveTickets(tickets);

  res.status(201).json(newTicket);
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});


